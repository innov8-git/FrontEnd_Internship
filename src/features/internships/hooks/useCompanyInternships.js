import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  EVENT_PARTNER_COMPANIES_UPDATED,
  STORAGE_KEY_PARTNER_COMPANIES,
  addOrUpdateCompanyInternship,
  deleteCompanyInternship,
  flattenCompanyPositions,
  getStoredPartnerCompanies,
  resetStoredPartnerCompanies,
} from '../data/companyInternshipsStore';

/**
 * React hook to access, monitor, and manipulate the centralized partner companies
 * and their internship roles across Home Page, Catalog, and Admin Panel.
 */
export function useCompanyInternships() {
  const [companies, setCompanies] = useState(() => getStoredPartnerCompanies());

  const refresh = useCallback(() => {
    setCompanies(getStoredPartnerCompanies());
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

  const addInternship = useCallback((formData) => {
    const createdRole = addOrUpdateCompanyInternship(formData);
    refresh();
    return createdRole;
  }, [refresh]);

  const updateInternship = useCallback((roleId, formData) => {
    const updatedRole = addOrUpdateCompanyInternship(formData, roleId);
    refresh();
    return updatedRole;
  }, [refresh]);

  const deleteInternship = useCallback((roleId) => {
    const remaining = deleteCompanyInternship(roleId);
    refresh();
    return remaining;
  }, [refresh]);

  const resetToDefaults = useCallback(() => {
    const defaults = resetStoredPartnerCompanies();
    setCompanies(defaults);
    return defaults;
  }, []);

  return {
    companies,
    allPositionCards,
    addInternship,
    updateInternship,
    deleteInternship,
    resetToDefaults,
    refresh,
  };
}

export default useCompanyInternships;
