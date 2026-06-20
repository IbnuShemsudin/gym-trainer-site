import { useState, useEffect } from "react";
import { apiFetch, BASE_API_URL } from "../services/adminApi";

export default function useDashboardData(token) {
  const [loading, setLoading] = useState(true);

  const [leads, setLeads] = useState([]);
  const [members, setMembers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [pricing, setPricing] = useState([]);

  const fetchAllData = async () => {
    try {
      const [
        leadsResponse,
        membersResponse,
        requestsResponse,
        galleryResponse,
        pricingResponse,
      ] = await Promise.all([
        apiFetch(`${BASE_API_URL}/api/leads`, token),
        apiFetch(`${BASE_API_URL}/api/admin/members`, token),
        apiFetch(`${BASE_API_URL}/api/admin/requests`, token),
        apiFetch(`${BASE_API_URL}/api/gallery`, token),
        apiFetch(`${BASE_API_URL}/api/pricing`, token),
      ]);

      setLeads(leadsResponse.data?.data || []);
      setMembers(membersResponse.data?.data || []);
      setRequests(requestsResponse.data?.data || []);
      setGallery(galleryResponse.data?.data || []);
      setPricing(pricingResponse.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAllData();
  }, [token]);

  return {
    loading,
    leads,
    members,
    requests,
    gallery,
    pricing,
    setLeads,
    setMembers,
    setRequests,
    setGallery,
    setPricing,
    fetchAllData,
  };
}