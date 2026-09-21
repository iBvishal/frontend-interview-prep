/**
 * WHY: Telephony carriers transmit SMS in 140-byte payloads:
 * - 'GSM-7': 7-bit ASCII encoding allowing 160 chars/segment (153 if concatenated)
 * - 'UCS-2': 16-bit Unicode encoding triggered by ANY non-GSM character (emojis, smart quotes, accents)
 *            which cuts capacity down to 70 chars/segment (67 if concatenated).
 */
export type SmsEncoding = 'GSM-7' | 'UCS-2';

/**
 * Result of the real-time SMS inspection & carrier compliance analysis.
 */
export interface SmsAnalysis {
  text: string;
  charCount: number; // total glyph count

  /** Detected character set ('GSM-7' vs 'UCS-2') */
  encoding: SmsEncoding;

  /** Number of billable 140-byte carrier segments */
  segmentCount: number;

  /** Characters left before another billable segment is added */
  remainingInSegment: number;

  /** Characters that triggered the UCS-2 downgrade (e.g. ['🚀', '“']) */
  nonGsmChars: string[];

  /** WHY: 10DLC telecom compliance requires opt-out language (STOP/UNSUBSCRIBE) */
  hasOptOut: boolean;

  /** HOW: segmentCount * recipients * carrier rate ($0.0079) */
  estimatedCost: number;
}
