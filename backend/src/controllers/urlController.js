const pool = require("../db/db");

const suspiciousTlds = [".xyz", ".ru", ".tk", ".top", ".gq", ".ml", ".cf"];
const suspiciousKeywords = [
  "login",
  "verify",
  "bank",
  "secure",
  "update",
  "account",
  "password",
  "signin",
  "confirm",
  "wallet",
  "reset",
];
const trustedBrands = [
  "paypal",
  "gmail",
  "google",
  "facebook",
  "instagram",
  "microsoft",
  "apple",
  "amazon",
  "netflix",
  "whatsapp",
  "opay",
  "gtbank",
  "accessbank",
];

const checkUrl = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== "string") {
      return res.status(400).json({
        success: false,
        message: "A valid URL is required",
      });
    }

    let riskScore = 0;
    let findings = [];
    let parsedUrl;

    try {
      parsedUrl = new URL(url);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid URL format",
      });
    }

    const hostname = parsedUrl.hostname.toLowerCase();
    const pathname = parsedUrl.pathname.toLowerCase();
    const fullUrl = url.toLowerCase();

    // Rule 1: IP address instead of domain
    const ipRegex = /^(?:\d{1,3}\.){3}\d{1,3}$/;
    if (ipRegex.test(hostname)) {
      riskScore += 25;
      findings.push("Uses an IP address instead of a normal domain");
    }

    // Rule 2: No HTTPS
    if (parsedUrl.protocol !== "https:") {
      riskScore += 10;
      findings.push("Does not use HTTPS");
    }

    // Rule 3: Suspicious keywords
    suspiciousKeywords.forEach((word) => {
      if (fullUrl.includes(word)) {
        riskScore += 5;
        findings.push(`Contains suspicious keyword: ${word}`);
      }
    });

    // Rule 4: Very long URL
    if (url.length > 75) {
      riskScore += 10;
      findings.push("URL is unusually long");
    }

    // Rule 5: Suspicious top-level domains
    const matchedTld = suspiciousTlds.find((tld) => hostname.endsWith(tld));
    if (matchedTld) {
      riskScore += 15;
      findings.push(`Uses a suspicious top-level domain: ${matchedTld}`);
    }

    // Rule 6: Too many subdomains
    const domainParts = hostname.split(".");
    if (domainParts.length > 4) {
      riskScore += 10;
      findings.push("Contains too many subdomains");
    }

    // Rule 7: @ symbol trick
    if (url.includes("@")) {
      riskScore += 20;
      findings.push("Contains @ symbol, which can be used to hide the real destination");
    }

    // Rule 8: URL encoding / obfuscation tricks
    const encodingPatterns = ["%20", "%00", "%2e", "%2f", "%5c", "%40"];
    const foundEncoding = encodingPatterns.some((pattern) => fullUrl.includes(pattern));
    if (foundEncoding) {
      riskScore += 15;
      findings.push("Contains encoded characters often used to hide malicious intent");
    }

    // Rule 9: Too many hyphens in hostname
    const hyphenCount = (hostname.match(/-/g) || []).length;
    if (hyphenCount >= 3) {
      riskScore += 10;
      findings.push("Domain contains too many hyphens");
    }

    // Rule 10: Brand impersonation pattern
    trustedBrands.forEach((brand) => {
      if (hostname.includes(brand) && hostname !== `${brand}.com` && hostname !== `www.${brand}.com`) {
        const suspiciousBrandPattern =
          hostname.includes(`${brand}-`) ||
          hostname.includes(`-${brand}`) ||
          hostname.includes(`${brand}secure`) ||
          hostname.includes(`${brand}login`) ||
          hostname.includes(`${brand}verify`) ||
          hostname.includes(`${brand}update`) ||
          hostname.includes(`${brand}account`);

        if (suspiciousBrandPattern) {
          riskScore += 20;
          findings.push(`Possible brand impersonation attempt targeting ${brand}`);
        }
      }
    });

    // Rule 11: Suspicious path structure
    if (
      pathname.includes("login") ||
      pathname.includes("verify") ||
      pathname.includes("reset") ||
      pathname.includes("confirm") ||
      pathname.includes("secure")
    ) {
      riskScore += 10;
      findings.push("Suspicious path contains account/security-related terms");
    }

    // Deduplicate findings
    findings = [...new Set(findings)];

    let level = "Low";
    if (riskScore >= 75) level = "Very High";
    else if (riskScore >= 50) level = "High";
    else if (riskScore >= 25) level = "Medium";

    const findingsText =
      findings.length > 0 ? findings.join(", ") : "No obvious red flags detected";

    const result = await pool.query(
      `INSERT INTO url_checks (url, risk_score, level, findings)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [url, riskScore, level, findingsText]
    );

    return res.status(200).json({
      success: true,
      message: "URL analyzed and saved successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error in checkUrl:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to analyze and save URL",
      error: error.message,
    });
  }
};

const getUrlChecks = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM url_checks ORDER BY created_at DESC`
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching URL checks:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch URL checks",
      error: error.message,
    });
  }
};

module.exports = { checkUrl, getUrlChecks };