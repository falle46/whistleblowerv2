import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, Timestamp } from "firebase/firestore"
import { db } from "./firebase"

export interface ReportData {
  id?: string
  includePersonalInfo: boolean
  personalInfo?: {
    name: string
    email: string
    phone: string
  }
  allowContact: boolean
  contactInfo?: {
    email: string
    phone: string
  }
  violatorInfo: {
    name: string
    position: string
    department: string
    location: string
    nip: string
  }
  violationType: string
  customViolationType?: string
  place: string
  time: string
  description: string
  attachments?: AttachmentData[]
  reportCode: string
  isRead: boolean
  createdAt: Timestamp
}

export interface AttachmentData {
  name: string
  data: string // base64 data
  type: string
  size: number
}

// Generate report code based on violation type and timestamp
export const generateReportCode = (violationType: string): string => {
  const violationCodes: { [key: string]: string } = {
    Korupsi: "A",
    Penyuapan: "B",
    "Pencucian Uang": "C",
    "Pelanggaran Etika": "D",
    Diskriminasi: "E",
    "Keselamatan Kerja": "F",
    Lainnya: "Z",
  }

  const now = new Date()
  const dateStr = now.toISOString().slice(2, 10).replace(/-/g, "") // YYMMDD format
  const timeStr = now.toTimeString().slice(0, 5).replace(":", "") // HHMM format

  const code = violationCodes[violationType] || "Z"
  return `${code}${dateStr}${timeStr}`
}

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

const processAttachment = async (file: File): Promise<AttachmentData> => {
  try {
    const base64Data = await convertFileToBase64(file)

    return {
      name: file.name,
      data: base64Data,
      type: file.type,
      size: file.size,
    }
  } catch (error) {
    console.error("Error processing file:", error)
    throw error
  }
}

// Add new report to Firestore
export const addReport = async (
  reportData: Omit<ReportData, "id" | "reportCode" | "isRead" | "createdAt">,
  attachments?: File[],
): Promise<string> => {
  try {
    const reportCode = generateReportCode(reportData.violationType)

    let processedAttachments: AttachmentData[] = []
    if (attachments && attachments.length > 0) {
      // Process all files to base64 - much faster than Firebase Storage
      processedAttachments = await Promise.all(attachments.map(processAttachment))
    }

    const cleanData = Object.fromEntries(
      Object.entries({
        ...reportData,
        ...(processedAttachments.length > 0 && { attachments: processedAttachments }),
        reportCode,
        isRead: false,
        createdAt: Timestamp.now(),
      }).filter(([_, value]) => value !== undefined),
    )

    const docRef = await addDoc(collection(db, "reports"), cleanData)
    return reportCode
  } catch (error) {
    console.error("Error adding report:", error)
    throw error
  }
}

// Get all reports ordered by creation date (newest first)
export const getReports = async (): Promise<ReportData[]> => {
  try {
    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as ReportData,
    )
  } catch (error) {
    console.error("Error getting reports:", error)
    throw error
  }
}

// Mark report as read
export const markReportAsRead = async (reportId: string): Promise<void> => {
  try {
    const reportRef = doc(db, "reports", reportId)
    await updateDoc(reportRef, {
      isRead: true,
    })
  } catch (error) {
    console.error("Error marking report as read:", error)
    throw error
  }
}

// Employee interface and management functions
export interface Employee {
  id?: string
  name: string
  nip: string
  birthDate: string
  division: string
  isApproved: boolean
  createdAt: Timestamp
  approvedAt?: Timestamp
  approvedBy?: string
}

// Sanction interface for punishment system
export interface Sanction {
  id?: string
  reportId: string
  reportCode: string
  employeeNip: string
  employeeName: string
  violationType: string
  sanctionType: string
  duration: number // in days
  startDate: Timestamp
  endDate: Timestamp
  description: string
  isActive: boolean
  isExpired: boolean
  approvedBy: string
  createdAt: Timestamp
}

// Employee Management Functions
export const addEmployee = async (employeeData: Omit<Employee, "id" | "isApproved" | "createdAt">): Promise<string> => {
  try {
    const cleanData = {
      ...employeeData,
      isApproved: false,
      createdAt: Timestamp.now(),
    }

    const docRef = await addDoc(collection(db, "employees"), cleanData)
    return docRef.id
  } catch (error) {
    console.error("Error adding employee:", error)
    throw error
  }
}

export const getEmployees = async (): Promise<Employee[]> => {
  try {
    const q = query(collection(db, "employees"), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Employee,
    )
  } catch (error) {
    console.error("Error getting employees:", error)
    throw error
  }
}

export const updateEmployee = async (employeeId: string, employeeData: Partial<Employee>): Promise<void> => {
  try {
    const employeeRef = doc(db, "employees", employeeId)
    await updateDoc(employeeRef, employeeData)
  } catch (error) {
    console.error("Error updating employee:", error)
    throw error
  }
}

export const deleteEmployee = async (employeeId: string): Promise<void> => {
  try {
    const employeeRef = doc(db, "employees", employeeId)
    await deleteDoc(employeeRef)
  } catch (error) {
    console.error("Error deleting employee:", error)
    throw error
  }
}

export const approveEmployee = async (employeeId: string, approvedBy: string): Promise<void> => {
  try {
    const employeeRef = doc(db, "employees", employeeId)
    await updateDoc(employeeRef, {
      isApproved: true,
      approvedAt: Timestamp.now(),
      approvedBy: approvedBy,
    })
  } catch (error) {
    console.error("Error approving employee:", error)
    throw error
  }
}

// Sanction Management Functions
export const addSanction = async (
  sanctionData: Omit<Sanction, "id" | "isActive" | "isExpired" | "createdAt">,
): Promise<string> => {
  try {
    const startDate = Timestamp.now()
    const endDate = Timestamp.fromDate(new Date(Date.now() + sanctionData.duration * 24 * 60 * 60 * 1000))

    const cleanData = {
      ...sanctionData,
      startDate,
      endDate,
      isActive: true,
      isExpired: false,
      createdAt: startDate,
    }

    const docRef = await addDoc(collection(db, "sanctions"), cleanData)
    return docRef.id
  } catch (error) {
    console.error("Error adding sanction:", error)
    throw error
  }
}

export const getSanctions = async (): Promise<Sanction[]> => {
  try {
    const q = query(collection(db, "sanctions"), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    const sanctions = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Sanction,
    )

    // Check and update expired sanctions
    const now = new Date()
    for (const sanction of sanctions) {
      if (sanction.isActive && !sanction.isExpired && sanction.endDate.toDate() <= now) {
        await updateDoc(doc(db, "sanctions", sanction.id!), {
          isActive: false,
          isExpired: true,
        })
        sanction.isActive = false
        sanction.isExpired = true
      }
    }

    return sanctions
  } catch (error) {
    console.error("Error getting sanctions:", error)
    throw error
  }
}

export const updateSanction = async (sanctionId: string, sanctionData: Partial<Sanction>): Promise<void> => {
  try {
    const sanctionRef = doc(db, "sanctions", sanctionId)
    await updateDoc(sanctionRef, sanctionData)
  } catch (error) {
    console.error("Error updating sanction:", error)
    throw error
  }
}
