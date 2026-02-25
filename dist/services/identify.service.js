"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reconcileIdentity = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const reconcileIdentity = async (email, phoneNumber) => {
    if (!email && !phoneNumber) {
        throw new Error("Invalid input");
    }
    //  Find all contacts matching email or phone
    const matchedContacts = await client_1.default.contact.findMany({
        where: {
            OR: [
                { email: email || undefined },
                { phoneNumber: phoneNumber || undefined },
            ],
        },
    });
    //  If no contacts exist → create primary
    if (matchedContacts.length === 0) {
        const newContact = await client_1.default.contact.create({
            data: {
                email,
                phoneNumber,
                linkPrecedence: "primary",
            },
        });
        return {
            primaryContactId: newContact.id,
            emails: [newContact.email].filter(Boolean),
            phoneNumbers: [newContact.phoneNumber].filter(Boolean),
            secondaryContactIds: [],
        };
    }
    //  Get all related contacts (including linked ones)
    const allRelatedIds = new Set();
    for (const contact of matchedContacts) {
        allRelatedIds.add(contact.id);
        if (contact.linkedId) {
            allRelatedIds.add(contact.linkedId);
        }
    }
    const allContacts = await client_1.default.contact.findMany({
        where: {
            OR: [
                { id: { in: Array.from(allRelatedIds) } },
                { linkedId: { in: Array.from(allRelatedIds) } },
            ],
        },
        orderBy: { createdAt: "asc" },
    });
    //  Oldest contact becomes primary
    const primaryContact = allContacts[0];
    //  Convert all others to secondary if needed
    for (const contact of allContacts) {
        if (contact.id !== primaryContact.id) {
            if (contact.linkPrecedence === "primary") {
                await client_1.default.contact.update({
                    where: { id: contact.id },
                    data: {
                        linkPrecedence: "secondary",
                        linkedId: primaryContact.id,
                    },
                });
            }
        }
    }
    //  If incoming info is new → create secondary
    const emailExists = allContacts.some((c) => c.email === email);
    const phoneExists = allContacts.some((c) => c.phoneNumber === phoneNumber);
    if (!emailExists || !phoneExists) {
        await client_1.default.contact.create({
            data: {
                email,
                phoneNumber,
                linkedId: primaryContact.id,
                linkPrecedence: "secondary",
            },
        });
    }
    //  Final unified list
    const finalContacts = await client_1.default.contact.findMany({
        where: {
            OR: [
                { id: primaryContact.id },
                { linkedId: primaryContact.id },
            ],
        },
        orderBy: { createdAt: "asc" },
    });
    const emails = [
        ...new Set(finalContacts.map((c) => c.email).filter(Boolean)),
    ];
    const phoneNumbers = [
        ...new Set(finalContacts.map((c) => c.phoneNumber).filter(Boolean)),
    ];
    const secondaryContactIds = finalContacts
        .filter((c) => c.linkPrecedence === "secondary")
        .map((c) => c.id);
    return {
        primaryContactId: primaryContact.id,
        emails,
        phoneNumbers,
        secondaryContactIds,
    };
};
exports.reconcileIdentity = reconcileIdentity;
