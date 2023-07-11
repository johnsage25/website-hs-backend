import collect from "collect.js";
import * as CryptoJS from "crypto-js";
const crypto = require("crypto");


const firewallRules = [
  { value: "ip", label: "ip", description: "Internet Protocol" },
  { value: "icmp", label: "icmp", description: "Internet Control Message Protocol" },
  { value: "igmp", label: "igmp", description: "Internet Group Management Protocol" },
  { value: "ggp", label: "ggp", description: "Gateway-to-Gateway Protocol" },
  { value: "ipencap", label: "ipencap", description: "IP encapsulated in IP" },
  { value: "st", label: "st", description: "Stream Protocol" },
  { value: "tcp", label: "tcp", description: "Transmission Control Protocol" },
  { value: "egp", label: "egp", description: "Exterior Gateway Protocol" },
  { value: "pup", label: "pup", description: "PARC Universal Packet Protocol" },
  { value: "udp", label: "udp", description: "User Datagram Protocol" },
  { value: "hmp", label: "hmp", description: "Host Monitoring Protocol" },
  { value: "xns-idp", label: "xns-idp", description: "Xerox NS IDP Protocol" },
  { value: "rdp", label: "rdp", description: "Reliable Data Protocol" },
  { value: "iso-tp4", label: "iso-tp4", description: "ISO Transport Protocol Class 4" },
  { value: "dccp", label: "dccp", description: "Datagram Congestion Control Protocol" },
  { value: "xtp", label: "xtp", description: "Xpress Transfer Protocol" },
  { value: "ddp", label: "ddp", description: "Datagram Delivery Protocol" },
  { value: "idpr-cmtp", label: "idpr-cmtp", description: "IDPR Control Message Transport Protocol" },
  { value: "ipv6", label: "ipv6", description: "Internet Protocol Version 6" },
  { value: "ipv6-route", label: "ipv6-route", description: "Routing Header for IPv6" },
  { value: "ipv6-frag", label: "ipv6-frag", description: "Fragment Header for IPv6" },
  { value: "idrp", label: "idrp", description: "Inter-Domain Routing Protocol" },
  { value: "rsvp", label: "rsvp", description: "Resource Reservation Protocol" },
  { value: "gre", label: "gre", description: "Generic Routing Encapsulation" },
  { value: "esp", label: "esp", description: "Encapsulating Security Payload" },
  { value: "ah", label: "ah", description: "Authentication Header" },
  { value: "skip", label: "skip", description: "SKIP" },
  { value: "ipv6-icmp", label: "ipv6-icmp", description: "Internet Control Message Protocol for IPv6" },
  { value: "ipv6-nonxt", label: "ipv6-nonxt", description: "No Next Header for IPv6" },
  { value: "ipv6-opts", label: "ipv6-opts", description: "Destination Options for IPv6" },
  { value: "rspf", label: "rspf", description: "Radio Shortest Path First" },
  { value: "vmtp", label: "vmtp", description: "Versatile Message Transaction Protocol" },
  { value: "eigrp", label: "eigrp", description: "Enhanced Interior Gateway Routing Protocol" },
  { value: "ospf", label: "ospf", description: "Open Shortest Path First" },
  { value: "ax.25", label: "ax.25", description: "AX.25 Frames" },
  { value: "ipip", label: "ipip", description: "IP-within-IP Encapsulation Protocol" },
  { value: "etherip", label: "etherip", description: "Ethernet-within-IP Encapsulation" },
  { value: "encap", label: "encap", description: "Encapsulation Header" },
  { value: "pim", label: "pim", description: "Protocol Independent Multicast" },
  { value: "ipcomp", label: "ipcomp", description: "IP Payload Compression Protocol" },
  { value: "vrrp", label: "vrrp", description: "Virtual Router Redundancy Protocol" },
  { value: "l2tp", label: "l2tp", description: "Layer Two Tunneling Protocol" },
  { value: "isis", label: "isis", description: "IS-IS over IPv4" },
  { value: "sctp", label: "sctp", description: "Stream Control Transmission Protocol" },
  { value: "fc", label: "fc", description: "Fibre Channel" },
  { value: "mobility-header", label: "mobility-header", description: "Mobility Extension Header for IPv6" },
  { value: "udplite", label: "udplite", description: "UDP-Lite" },
  { value: "mpls-in-ip", label: "mpls-in-ip", description: "Multiprotocol Label Switching Encapsulated in IP" },
  { value: "manet", label: "manet", description: "MANET Protocols" },
  { value: "hip", label: "hip", description: "Host Identity Protocol" },
  { value: "shim6", label: "shim6", description: "Shim6 Protocol" },
  { value: "wesp", label: "wesp", description: "Wrapped Encapsulating Security Payload" },
  { value: "rohc", label: "rohc", description: "Robust Header Compression" }
]

function splitDomain(
  domain: string,
  defaultExtension = "com"
): [string, string] {
  const parts = domain.split(".");
  if (parts.length === 1) {
    // domain doesn't have an extension, add default extension
    return [parts[0], defaultExtension];
  }
  const extension: any = parts.pop();
  const name = parts.join(".");
  return [name, extension];
}

function calculateDiscountPercentageHelper(
  salesPrice: number,
  promoPrice: number
): number {
  const percentage = ((salesPrice - promoPrice) / salesPrice) * 100;
  return percentage;
}

function getPercentageAmount(givenAmount: number, percentage: number) {
  const percentageAmount: number = (givenAmount * percentage) / 100;
  const totalAmount: number = givenAmount - percentageAmount;
  return totalAmount;
}

const PackageTerms = [
  // { value: "h", label: "Hourly" },
  { value: "m", label: "Monthly" },
  { value: "q", label: "Quarterly" },
  { value: "s", label: "SemAnnually" },
  { value: "a", label: "Yearly" },
  { value: "b", label: "Biennially" },
];

const TermsList = [
  { value: "m", label: "Monthly" },
  { value: "q", label: "Quarterly" },
  { value: "s", label: "Semi-Annually" },
  { value: "a", label: "Annually" },
  { value: "b", label: "Biennially" },
];

function isMastercardExpired(
  expirationYear: number,
  expirationMonth: number
): boolean {
  // Get the current date
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // January is 0, so add 1 to get the current month

  // Check if the card has already expired
  if (
    currentYear > expirationYear ||
    (currentYear === expirationYear && currentMonth > expirationMonth)
  ) {
    return true;
  }

  // Otherwise, the card is still valid
  return false;
}

// Encrypt a string
function encryptText(jsonObj: object, encryptionKey: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", encryptionKey, iv);

  let encryptedData = cipher.update(JSON.stringify(jsonObj), "utf8", "hex");
  encryptedData += cipher.final("hex");

  console.log(encryptedData);

  return encryptedData;
}

// Decrypt a string
function decryptText(encryptedObj, encryptionKey) {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    encryptionKey,
    Buffer.from(encryptedObj.iv, "hex")
  );

  let decryptedData = decipher.update(
    encryptedObj.encryptedData,
    "hex",
    "utf8"
  );
  decryptedData += decipher.final("utf8");

  return JSON.parse(decryptedData);
}

const currencyConverter = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 3,
    currency: "USD",
    style: "currency",
  }).format(amount);
};

const GetPeriodInString = (value?: string) => {
  let c = collect(PackageTerms);
  return c.firstWhere("value", value);
};

const GetProductPrice = (pricing?: any[], value?: string) => {
  let c = collect(pricing);
  return c.firstWhere("period", value);
};

export {
  splitDomain,
  isMastercardExpired,
  calculateDiscountPercentageHelper,
  encryptText,
  decryptText,
  GetProductPrice,
  firewallRules,
  GetPeriodInString,
  getPercentageAmount,
  TermsList,
  currencyConverter,
  PackageTerms,
};
