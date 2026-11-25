import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  EVENT_PARTNER_COMPANIES_UPDATED,
  STORAGE_KEY_PARTNER_COMPANIES,
  addOrUpdateCompanyInternship,
  deleteCompanyInternship,
  flattenCompanyPositions,
  getStoredPartnerCompanies,
  resetStoredPartnerCompanies,
  saveStoredPartnerCompanies,
} from '../data/companyInternshipsStore';
import {
  getPartnerInternships,
  createPartnerInternship,
  updatePartnerInternship,
  deletePartnerInternship,
  resetPartnerInternships,
} from '@/services/internshipService';

/**
 * React hook to access, monitor, and manipulate the centralized partner companies
 * and their internship roles across Home Page, Catalog, and Admin Panel.
 * Synchronizes with backend REST API with resilient fallback to local storage.
 */
export function useCompanyInternships() {
  const [companies, setCompanies] = useState(() => getStoredPartnerCompanies());
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(() => {
    setCompanies(getStoredPartnerCompanies());
  }, []);

  // Fetch from backend API on mount
  useEffect(() => {
    let mounted = true;
    async function syncFromBackend() {
      try {
        setIsLoading(true);
        const res = await getPartnerInternships();
        const backendCompanies = res?.companies || (Array.isArray(res) ? res : null);
        if (mounted && Array.isArray(backendCompanies) && backendCompanies.length > 0) {
          saveStoredPartnerCompanies(backendCompanies);
          setCompanies(backendCompanies);
        }
      } catch {
        // Backend offline or unavailable, gracefully retain local state
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    syncFromBackend();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    function handleUpdate(e) {
      if (e?.detail) {
        setCompanies(e.detail);
      } else {
        refresh();
      }
    }

    function handleStorage(e) {
      if (e.key === STORAGE_KEY_PARTNER_COMPANIES) {
        refresh();
      }
    }

    window.addEventListener(EVENT_PARTNER_COMPANIES_UPDATED, handleUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(EVENT_PARTNER_COMPANIES_UPDATED, handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [refresh]);

  const allPositionCards = useMemo(() => {
    return flattenCompanyPositions(companies);
  }, [companies]);

  const addInternship = useCallback(
    async (formData) => {
      const createdRole = addOrUpdateCompanyInternship(formData);
      refresh();
      try {
        await createPartnerInternship({
          ...formData,
          id: createdRole?.id,
        });
      } catch {
        // Backend failure handled gracefully by client-side store
      }
      return createdRole;
    },
    [refresh],
  );

  const updateInternship = useCallback(
    async (roleId, formData) => {
      const updatedRole = addOrUpdateCompanyInternship(formData, roleId);
      refresh();
      try {
        await updatePartnerInternship(roleId, formData);
      } catch {
        // Handled gracefully
      }
      return updatedRole;
    },
    [refresh],
  );

  const deleteInternship = useCallback(
    async (roleId) => {
      const remaining = deleteCompanyInternship(roleId);
      refresh();
      try {
        await deletePartnerInternship(roleId);
      } catch {
        // Handled gracefully
      }
      return remaining;
    },
    [refresh],
  );

  const resetToDefaults = useCallback(async () => {
    const defaults = resetStoredPartnerCompanies();
    setCompanies(defaults);
    try {
      await resetPartnerInternships();
    } catch {
      // Handled gracefully
    }
    return defaults;
  }, []);

  return {
    companies,
    allPositionCards,
    isLoading,
    addInternship,
    updateInternship,
    deleteInternship,
    resetToDefaults,
    refresh,
  };
}

export default useCompanyInternships;
