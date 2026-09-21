# Problem 3: International SMS Segment Calculator & Compliance Checker

## Background
Telephony carriers charge SMS per "segment".
- Standard ASCII characters use **GSM-7 encoding**:
  - Single segment: up to 160 chars.
  - Multi-segment: 153 chars per segment (7 chars reserved for User Data Header / concatenation).
- If any non-GSM character is included (e.g., emojis 🚀, smart quotes “”, accented glyphs, Cyrillic, Chinese):
  - Switches entirely to **UCS-2 encoding** (UTF-16).
  - Single segment: up to 70 chars.
  - Multi-segment: 67 chars per segment!
- Furthermore, 10DLC compliance in the US/International markets requires mandatory opt-out text (`STOP`, `UNSUBSCRIBE`, etc.) for commercial messaging.

## The Task
Build an interactive SMS campaign message editor with real-time segment calculation, encoding detection, highlight of non-GSM culprit characters, and compliance validation.

## Functional Requirements
1. **Real-time Segment & Character Counting:**
   - Detect GSM-7 vs. UCS-2 character set dynamically.
   - Show: `Total characters`, `Segments used`, `Characters remaining in current segment`.
   - Calculate estimated message cost ($0.0079 per segment * segments * recipient count).
2. **Culprit Character Highlighting:**
   - If UCS-2 encoding is triggered, render an overlay or preview that highlights exactly which characters caused the downgrade to UCS-2.
3. **Compliance Checklist:**
   - Real-time badges indicating:
     - Includes Opt-Out keyword (`STOP`, `END`, `CANCEL`, `UNSUBSCRIBE`).
     - Sender identity identified (`Reply STOP to opt out of [Company] alerts`).
     - Link shortener warning (public shorteners like bit.ly are flagged by carriers).
4. **Interactive Phone Preview:**
   - Render a realistic mobile phone mockup showing how the segmented message looks to the recipient.
