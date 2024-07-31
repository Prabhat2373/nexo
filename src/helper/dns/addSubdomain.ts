import axios from "axios";

const CLOUDFLARE_API_TOKEN = "your-cloudflare-api-token";
const CLOUDFLARE_ZONE_ID = "your-cloudflare-zone-id";

const addSubdomain = async (subdomain: string) => {
  const url = `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
  };
  const data = {
    type: "A",
    name: `${subdomain}.yourdomain.com`,
    content: "your-server-ip",
    ttl: 1, // Auto TTL
    proxied: false,
  };

  try {
    const response = await axios.post(url, data, { headers });
    if (response.data.success) {
      console.log("Subdomain added successfully:", response.data.result);
    } else {
      console.log("Failed to add subdomain:", response.data.errors);
    }
  } catch (error) {
    console.error("Error adding subdomain:", error);
  }
};

export default addSubdomain;
