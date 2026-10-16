// Score ke hisaab se rang aur label.
// Sirf rang par depend nahi karte, label bhi dikhate hain (colour-blind users ke liye).
export function scoreTone(percent) {
  if (percent >= 70) return { color: "var(--color-good)", label: "Strong" };
  if (percent >= 40) return { color: "var(--color-mid)", label: "Getting there" };
  return { color: "var(--color-miss)", label: "Needs work" };
}
