import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const repairTitles = [
  "iPhone 15 Screen Replacement",
  "Samsung Galaxy S24 Battery Replacement",
  "MacBook Pro Keyboard Repair",
  "Dell XPS 15 Charging Port Fix",
  "iPad Air Cracked Screen",
  "HP Laptop SSD Upgrade",
  "OnePlus 12 Camera Repair",
  "Google Pixel 8 USB-C Fix",
  "Lenovo ThinkPad Thermal Paste",
  "AirPods Pro Battery Service",
  "PS5 Controller Drift Repair",
  "Nintendo Switch Screen Replacement",
  "Canon Camera Lens Calibration",
  "Sony Headphones Hinge Repair",
  "Xbox Series X Power Supply",
  "iPhone 14 Pro Max Back Glass",
  "Samsung Tab S9 Screen Crack",
  "Mac Mini Logic Board Repair",
  "Alienware Laptop Fan Replacement",
  "iPad Mini Home Button Fix",
  "Google Nest Hub Display Repair",
  "Amazon Echo Speaker Crackle",
  "Fitbit Charge 6 Strap Repair",
  "Dyson V15 Battery Replacement",
  "Roomba J7 Sensor Cleaning",
  "iPhone SE Home Button Repair",
  "Samsung Watch 6 Screen Scratch",
  "LG Monitor Power LED Fix",
  "Razer Blade Trackpad Repair",
  "Surface Pro 9 Kickstand Fix",
  "Bose QC45 Ear Pad Replacement",
  "Logitech MX Keys Keycap Repair",
  "DJI Mini 3 Gimbal Calibration",
  "GoPro Hero 12 Lens Replacement",
  "Apple Watch Ultra Screen Repair",
  "Samsung Galaxy Buds Charging Fix",
  "PS4 HDMI Port Replacement",
  "Nintendo 3DS Hinge Repair",
  "Canon Printer Paper Jam Fix",
  "HP Envy Webcam Not Working",
  "Acer Predator Keyboard Backlight",
  "ASUS ROG GPU Fan Replacement",
  "Microsoft Wireless Mouse Scroll",
  "Pixel Tablet Speaker Repair",
  "Nothing Phone 2 Charging Port",
  "Motorola Edge 40 Screen Repair",
  "Xiaomi Pad 6 Screen Replacement",
  "Oura Ring Gen 3 Charging Issue",
  "Kindle Paperwhite Screen Fix",
  "iMac 27 Power Supply Repair",
];

const firstNames = ["James","Maria","David","Sarah","Michael","Emily","Robert","Jessica","William","Amanda","Christopher","Ashley","Daniel","Jennifer","Matthew","Samantha","Andrew","Stephanie","Joshua","Nicole","Ryan","Elizabeth","Jacob","Megan","Nicholas","Lauren","Brandon","Kimberly","Tyler","Heather","Ethan","Amber","Alexander","Brittany","Caleb","Danielle","Nathan","Rachel","Samuel","Victoria","Benjamin","Sofia","Henry","Aria","Lucas","Elena","Jack","Zoe","Owen","Lily"];

const lastNames = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez","Hernandez","Lopez","Gonzalez","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin","Lee","Perez","Thompson","White","Harris","Sanchez","Clark","Ramirez","Lewis","Robinson","Walker","Young","Allen","King","Wright","Scott","Torres","Hill","Green","Adams","Baker","Nelson","Carter","Mitchell","Roberts","Turner","Phillips","Campbell","Parker","Evans"];

const streets = ["Main St","Oak Ave","Elm St","Pine Rd","Cedar Ln","Maple Dr","Birch Way","Walnut Ct","Cherry Blvd","Spruce Ave","Willow Ln","Ash St","Poplar Ave","Hickory Rd","Sycamore Dr"];

const categories = ["Phone Repair","Laptop Repair","Tablet Repair","Electronics","Garage","Appliance","Tailoring","Bakery"];

const employeeNames = [
  { name: "Alice Chen", email: "alice@trackdesk.com" },
  { name: "Bob Martinez", email: "bob@trackdesk.com" },
  { name: "Carol Smith", email: "carol@trackdesk.com" },
  { name: "Dave Johnson", email: "dave@trackdesk.com" },
  { name: "Eve Williams", email: "eve@trackdesk.com" },
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - randomInt(0, daysAgo));
  d.setHours(randomInt(9, 18), randomInt(0, 59), 0, 0);
  return d;
}

async function main() {
  console.log("Clearing existing data...");
  await prisma.notification.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.timeline.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  const pwd = await bcrypt.hash("admin123", 12);

  // Create admin
  const admin = await prisma.user.create({
    data: { email: "admin@trackdesk.com", name: "Admin", password: pwd, role: "ADMIN" },
  });

  // Create 5 employees
  const employees = [admin];
  for (const emp of employeeNames) {
    const u = await prisma.user.create({
      data: { ...emp, password: pwd, role: "EMPLOYEE" },
    });
    employees.push(u);
  }

  // Create 50 customers
  const customers: any[] = [];
  const usedNames = new Set<string>();
  for (let i = 0; i < 50; i++) {
    let name: string;
    do {
      name = `${randomItem(firstNames)} ${randomItem(lastNames)}`;
    } while (usedNames.has(name));
    usedNames.add(name);

    const phone = `+1 (${randomInt(200, 999)}) ${randomInt(100, 999)}-${randomInt(1000, 9999)}`;
    const cust = await prisma.customer.create({
      data: {
        name,
        phone,
        email: `${name.toLowerCase().replace(" ", ".")}@email.com`,
        address: `${randomInt(100, 9999)} ${randomItem(streets)}`,
        notes: Math.random() > 0.7 ? `Regular customer since ${2024 - randomInt(0, 2)}` : null,
      },
    });
    customers.push(cust);
  }

  // Create 150 tickets across 90 days
  const statuses = [
    "RECEIVED", "DIAGNOSING", "WAITING_APPROVAL", "WAITING_PARTS",
    "REPAIR_IN_PROGRESS", "QUALITY_CHECK", "READY_FOR_PICKUP", "DELIVERED", "CANCELLED", "CLOSED",
  ] as const;

  const tickets: any[] = [];
  for (let i = 0; i < 150; i++) {
    const title = repairTitles[i % repairTitles.length];
    const category = randomItem(categories);
    const customer = randomItem(customers);
    const employee = randomItem(employees);
    const createdAt = randomDate(90);
    const estimatedCost = randomInt(29, 999) + 0.99;
    const advancePaid = Math.random() > 0.5 ? randomInt(10, Math.floor(estimatedCost / 2)) : 0;
    const status = statuses[i % statuses.length];

    const ticket: any = {
      ticketNumber: `TKT-${String(2407000 + i).slice(-4)}`,
      title,
      description: `Customer reports: ${title.toLowerCase()}. Initial assessment needed.`,
      category,
      status,
      priority: randomItem(["LOW", "MEDIUM", "HIGH", "URGENT"]),
      estimatedCost: Math.round(estimatedCost * 100) / 100,
      advancePaid,
      remainingBalance: Math.round((estimatedCost - advancePaid) * 100) / 100,
      customerId: customer.id,
      assignedToId: employee.id,
      createdAt,
      updatedAt: createdAt,
    };

    // Add closed fields for closed/delivered tickets
    if (status === "CLOSED" || status === "DELIVERED") {
      const finalCost = estimatedCost * (1 + randomInt(-5, 15) / 100);
      ticket.finalCost = Math.round(finalCost * 100) / 100;
      ticket.paymentStatus = randomItem(["PAID", "PARTIALLY_PAID"]);
      ticket.paymentMethod = randomItem(["CASH", "CARD", "UPI", "BANK_TRANSFER"]);
      ticket.closedById = employee.id;
      ticket.closedDate = new Date(createdAt.getTime() + randomInt(1, 14) * 86400000);
    }

    const created = await prisma.ticket.create({ data: ticket });
    tickets.push(created);

    // Timeline entries
    const timelineEntries = [
      { action: "Ticket Created", details: `Ticket ${created.ticketNumber} was created`, createdAt: created.createdAt, employeeId: employee.id },
    ];

    if (status !== "RECEIVED") {
      timelineEntries.push({
        action: "Status Changed",
        details: `Status changed to ${status}`,
        createdAt: new Date(created.createdAt.getTime() + randomInt(1, 48) * 3600000),
        employeeId: employee.id,
      });
    }

    if (status === "CLOSED" || status === "DELIVERED") {
      timelineEntries.push({
        action: "Ticket Closed",
        details: `Final cost: $${ticket.finalCost?.toFixed(2)}. Payment: ${ticket.paymentStatus}`,
        createdAt: ticket.closedDate || new Date(created.createdAt.getTime() + randomInt(2, 14) * 86400000),
        employeeId: employee.id,
      });
    }

    await prisma.timeline.createMany({
      data: timelineEntries.map((e) => ({ ...e, ticketId: created.id })),
    });
  }

  console.log(`Seeded: 1 admin, ${employees.length - 1} employees, ${customers.length} customers, ${tickets.length} tickets`);
  console.log("Admin: admin@trackdesk.com / admin123");
  console.log("Employee: alice@trackdesk.com / admin123 (and 4 more)");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
