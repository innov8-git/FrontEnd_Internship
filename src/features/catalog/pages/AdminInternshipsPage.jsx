import { useMemo, useState } from 'react';
import { Button, Modal, PageHeader, Select, toast } from '@/shared/components/ui';
import { useDocumentTitle } from '@/shared/hooks';
import { useCompanyInternships } from '@/features/internships/hooks/useCompanyInternships';
import { InternshipDetailsModal } from '@/features/internships/components/InternshipDetailsModal';
import { CatalogTabs } from '../components/CatalogTabs';
import { InternshipEditorModal } from '../components/InternshipEditorModal';
import {
  Briefcase,
  Building2,
  Code2,
  Eye,
  Filter,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Smartphone,
  Trash2,
  Users,
} from '@/shared/icons';
import { cn } from '@/shared/utils/cn';

export default function AdminInternshipsPage() {
  useDocumentTitle('Partner Internships');

  const {
    companies,
    allPositionCards,
    addInternship,
    updateInternship,
    deleteInternship,
    resetToDefaults,
  } = useCompanyInternships();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [trackFilter, setTrackFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all');

  // Modals state
  const [editorState, setEditorState] = useState({ open: false, data: null });
  const [previewState, setPreviewState] = useState({ open: false, partner: null, role: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, role: null, partner: null });
  const [resetConfirm, setResetConfirm] = useState(false);

  // Available domain options for filter
  const domainFilterOptions = useMemo(() => {
    const set = new Set();
    companies.forEach((c) => {
      if (c.domain) set.add(c.domain);
      c.assignedDomains?.forEach((d) => set.add(d));
    });
    return Array.from(set);
  }, [companies]);

  const domainFilterSelectOptions = useMemo(() => {
    return [
      { value: 'all', label: 'All Domains' },
      ...domainFilterOptions.map((domain) => ({ value: domain, label: domain })),
    ];
  }, [domainFilterOptions]);

  // Filtered positions list
  const filteredPositions = useMemo(() => {
    return allPositionCards.filter(({ partner, role }) => {
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesCompany = partner.name?.toLowerCase().includes(query);
        const matchesRole = role.role?.toLowerCase().includes(query) || role.designation?.toLowerCase().includes(query);
        const matchesDomain = partner.domain?.toLowerCase().includes(query) || role.domains?.some((d) => d.toLowerCase().includes(query));
        if (!matchesCompany && !matchesRole && !matchesDomain) return false;
      }

      // Track filter
      if (trackFilter !== 'all' && role.track !== trackFilter) {
        return false;
      }

      // Domain filter
      if (domainFilter !== 'all') {
        const matchesMain = partner.domain === domainFilter;
        const matchesAssigned = role.domains?.includes(domainFilter) || partner.assignedDomains?.includes(domainFilter);
        if (!matchesMain && !matchesAssigned) return false;
      }

      return true;
    });
  }, [allPositionCards, searchQuery, trackFilter, domainFilter]);

  // Handlers
  const handleOpenCreate = () => {
    setEditorState({ open: true, data: null });
  };

  const handleOpenEdit = (position) => {
    setEditorState({ open: true, data: position });
  };

  const handleOpenPreview = (partner, role) => {
    setPreviewState({ open: true, partner, role });
  };

  const handleSaveInternship = (formData, originalRoleId) => {
    if (originalRoleId) {
      updateInternship(originalRoleId, formData);
      toast.success('Internship updated successfully!', {
        description: 'Changes are now live on Home page and Student Portal.',
      });
    } else {
      addInternship(formData);
      toast.success('New internship position created successfully!', {
        description: 'Position is now available for students to browse and apply.',
      });
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirm.role?.id) return;
    deleteInternship(deleteConfirm.role.id);
    toast.success('Internship removed successfully.');
    setDeleteConfirm({ open: false, role: null, partner: null });
  };

  const handleConfirmReset = () => {
    resetToDefaults();
    toast.success('Reset to default 4 partner companies successfully.');
    setResetConfirm(false);
  };

  // Stats
  const totalPositions = allPositionCards.length;
  const webCount = allPositionCards.filter((p) => p.role.track === 'web').length;
  const appCount = allPositionCards.filter((p) => p.role.track === 'app').length;
  const uniqueCompanies = companies.length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Catalog"
        title="Partner Internships"
        description="Manage partner companies, engineering tracks, responsibilities, technical requirements, and outcomes. Changes are instantly published to the Home page and Student Portal."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="md"
              leftIcon={RotateCcw}
              onClick={() => setResetConfirm(true)}
              title="Reset all internships back to the original 4 partner companies"
            >
              Reset to Defaults
            </Button>
            <Button
              variant="primary"
              size="md"
              leftIcon={Plus}
              onClick={handleOpenCreate}
            >
              Post New Internship
            </Button>
          </div>
        }
      >
        <CatalogTabs />
      </PageHeader>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Briefcase className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            <span>Total Positions</span>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {totalPositions}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Building2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Partner Companies</span>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {uniqueCompanies}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Code2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>Web Track Positions</span>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {webCount}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Smartphone className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span>App Track Positions</span>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {appCount}
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company, role title, or domain..."
            className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Track Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <div className="w-40 sm:w-44">
              <Select
                size="sm"
                aria-label="Filter by track"
                value={trackFilter}
                onChange={(e) => setTrackFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Tracks' },
                  { value: 'web', label: 'Web Development' },
                  { value: 'app', label: 'App Development' },
                ]}
              />
            </div>
          </div>

          {/* Domain Filter */}
          <div className="w-44 sm:w-48">
            <Select
              size="sm"
              aria-label="Filter by domain"
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              options={domainFilterSelectOptions}
            />
          </div>
        </div>
      </div>

      {/* Internships List Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                <th className="py-3.5 pl-6 pr-4">Partner Company</th>
                <th className="px-4 py-3.5">Role &amp; Track</th>
                <th className="px-4 py-3.5">Domains</th>
                <th className="px-4 py-3.5">Duration &amp; Mode</th>
                <th className="px-4 py-3.5 text-center">Specs</th>
                <th className="px-4 py-3.5 text-center">Candidates</th>
                <th className="py-3.5 pl-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPositions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <p className="font-semibold">No internships found matching your filters.</p>
                    <p className="mt-1 text-[11px]">Try adjusting your search query or track filter.</p>
                  </td>
                </tr>
              ) : (
                filteredPositions.map((position) => {
                  const { partner, role } = position;
                  const isWeb = role.track === 'web';

                  return (
                    <tr
                      key={position.id}
                      className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                    >
                      {/* Company Name & Logo */}
                      <td className="py-4 pl-6 pr-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white shadow-xs',
                              partner.logoBg || 'bg-brand-600',
                            )}
                          >
                            {partner.logoInitials || 'IS'}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {partner.name}
                            </span>
                            <p className="line-clamp-1 max-w-[220px] text-[11px] text-slate-500 dark:text-slate-400">
                              {partner.tagline}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role & Track */}
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <span className="font-bold text-slate-900 dark:text-white block">
                            {role.role}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                            {role.designation}
                          </span>
                          <div>
                            <span
                              className={cn(
                                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-xs',
                                isWeb
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                                  : 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
                              )}
                            >
                              {isWeb ? <Code2 className="h-3 w-3" /> : <Smartphone className="h-3 w-3" />}
                              <span>{role.trackLabel || (isWeb ? 'Web Development' : 'App Development')}</span>
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Domains */}
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {(role.domains || partner.assignedDomains || [partner.domain]).map((d) => (
                            <span
                              key={d}
                              className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Duration & Mode */}
                      <td className="px-4 py-4">
                        <div className="space-y-0.5 text-[11px]">
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {role.duration || '1 to 6 Months'}
                          </span>
                          <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            {role.workMode || '100% Online Remote'}
                          </p>
                        </div>
                      </td>

                      {/* Specs count */}
                      <td className="px-4 py-4 text-center">
                        <div className="inline-flex flex-col items-center text-[10px] text-slate-500 dark:text-slate-400">
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            {role.rolesAndResponsibilities?.length || 12} Areas
                          </span>
                          <span>{role.skillsRequired?.length || 8} Skills</span>
                        </div>
                      </td>

                      {/* Candidates enrolled */}
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                          <Users className="h-3.5 w-3.5 text-slate-400" />
                          <span>{role.applicantsCount || 120}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 pl-4 pr-6 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Preview Details Modal */}
                          <button
                            type="button"
                            onClick={() => handleOpenPreview(partner, role)}
                            className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                            title="Preview Student Details Modal"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {/* Edit Internship */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(position)}
                            className="rounded-lg border border-slate-200 bg-white p-1.5 text-brand-600 transition hover:bg-brand-50 hover:text-brand-700 dark:border-slate-700 dark:bg-slate-800 dark:text-brand-400 dark:hover:bg-slate-700"
                            title="Edit Internship Position"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          {/* Delete Internship */}
                          <button
                            type="button"
                            onClick={() => setDeleteConfirm({ open: true, role, partner })}
                            className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                            title="Delete Internship Position"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal for Adding / Editing */}
      <InternshipEditorModal
        open={editorState.open}
        onClose={() => setEditorState({ open: false, data: null })}
        onSave={handleSaveInternship}
        initialData={editorState.data}
      />

      {/* Live Preview using the exact Student InternshipDetailsModal */}
      {previewState.open && previewState.partner && (
        <InternshipDetailsModal
          open={previewState.open}
          onClose={() => setPreviewState({ open: false, partner: null, role: null })}
          partner={previewState.partner}
          initialRole={previewState.role}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, role: null, partner: null })}
        size="sm"
        title="Delete Internship Position?"
        description="Are you sure you want to remove this internship position? It will be removed from the Home page and Student Portal."
      >
        <div className="space-y-4 pt-2">
          {deleteConfirm.role && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-3 text-xs text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200">
              <strong>{deleteConfirm.partner?.name}:</strong> {deleteConfirm.role?.designation}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm({ open: false, role: null, partner: null })}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
            >
              Delete Position
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reset Confirmation Modal */}
      <Modal
        open={resetConfirm}
        onClose={() => setResetConfirm(false)}
        size="sm"
        title="Reset All Internships to Defaults?"
        description="This will restore the original 4 partner companies (Inlarge Software, Couldinger, Proton, and Ady Nexes) with their standard 8 Web & App development tracks."
      >
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setResetConfirm(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmReset}>
            Confirm Reset
          </Button>
        </div>
      </Modal>
    </div>
  );
}
