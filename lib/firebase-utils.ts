import { collection, addDoc, getDocs, doc, updateDoc, query, orderBy, Timestamp } from "firebase/firestore"
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
  }
  violationType: string
  customViolationType?: string
  place: string
  time: string
  description: string
  reportCode: string
  isRead: boolean
  createdAt: Timestamp
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

// Add new report to Firestore
export const addReport = async (
  reportData: Omit<ReportData, "id" | "reportCode" | "isRead" | "createdAt">,
): Promise<string> => {
  try {
    const reportCode = generateReportCode(reportData.violationType)

    const cleanData = Object.fromEntries(
      Object.entries({
        ...reportData,
        reportCode,
        isRead: false,
        createdAt: Timestamp.now(),
      }).filter(([_, value]) => value !== undefined),
    )

    const docRef = await addDoc(collection(db, "reports"), cleanData)
    return reportCode // Return the report code instead of doc ID
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
