import { Link } from 'react-router-dom';
import { Logo } from '@/shared/components/ui';
import { useAuth } from '@/shared/hooks';
import { APP_NAME, APP_TAGLINE, ROUTES, SUPPORT_EMAIL, getHomeRoute } from '@/shared/constants';
import { HOW_IT_WORKS_PATH } from './navigation';

const LINK_CLASS =
  'inline-block rounded-sm py-1 text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2';

function FooterLink({ link }) {
  if (link.href) {
    return (
      <a href={link.href} className={LINK_CLASS}>
        {link.label}
      </a>
    );
  }
  return (
    <Link to={link.to} className={LINK_CLASS}>
      {link.label}
    </Link>
  );
}

/** Public footer (SN1): brand, programme, support and account links. */
export function Footer() {
  const { user, status } = useAuth();
  const isSignedIn = status === 'authenticated' && Boolean(user);
  const year = new Date().getFullYear();

  const columns = [
    {
      title: 'Programme',
      links: [
        { label: 'Internships', to: ROUTES.CATALOG },
        { label: 'How it works', to: HOW_IT_WORKS_PATH },
        { label: 'Verify a certificate', to: ROUTES.VERIFY_CERTIFICATE },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Terms & conditions', to: ROUTES.TERMS },
        { label: 'Contact support', href: `mailto:${SUPPORT_EMAIL}` },
      ],
    },
    {
      title: 'Account',
      links: isSignedIn
        ? [
            { label: 'Go to dashboard', to: getHomeRoute(user) },
            { label: 'Browse internships', to: ROUTES.CATALOG },
          ]
        : [
            { label: 'Log in', to: ROUTES.LOGIN },
            { label: 'Create account', to: ROUTES.REGISTER },
          ],
    },
  ];

  return (
    <footer className="border-t border-slate-200 bg-slate-50 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="container-page py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo to={ROUTES.HOME} size="md" />
            <p className="mt-2 text-xs font-semibold tracking-wider uppercase text-brand-600 dark:text-brand-400">
              {APP_TAGLINE}
            </p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-slate-600 dark:text-slate-400">
              Assessment-based internships with real projects, GitHub reviews and verifiable
              certificates.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{column.title}</h2>
              <ul role="list" className="mt-3 space-y-1">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {year} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
