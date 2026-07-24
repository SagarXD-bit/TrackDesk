import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/api-utils";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse("Not authenticated", 401);

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const ticketId = formData.get("ticketId") as string;

    if (!file || !ticketId) {
      return errorResponse("File and ticketId are required", 400);
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return errorResponse("File type not allowed. Allowed: JPG, PNG, WEBP, PDF, DOCX", 400);
    }

    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) return errorResponse("Ticket not found", 404);

    const ext = path.extname(file.name) || ".bin";
    const filename = `${crypto.randomUUID()}${ext}`;
    const uploadPath = path.join(process.cwd(), UPLOAD_DIR);
    const filePath = path.join(uploadPath, filename);

    await mkdir(uploadPath, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const attachment = await prisma.attachment.create({
      data: {
        filename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url: `/${UPLOAD_DIR}/${filename}`,
        ticketId,
        uploadedById: user.id,
      },
    });

    await prisma.timeline.create({
      data: {
        action: "Attachment Added",
        details: `File ${file.name} uploaded`,
        ticketId,
        employeeId: user.id,
      },
    });

    return successResponse(attachment, 201);
  } catch (error) {
    console.error("Upload error:", error);
    return errorResponse("Internal server error", 500);
  }
}
