import type { Metadata } from 'next';
import { ArrowDownTrayIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

const cvPath = '/pdfs/cv.pdf';

export const metadata: Metadata = {
  title: 'CV',
  description: 'Embedded CV PDF for Rong Zou.',
};

export default function CVPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-col gap-4 border-b border-neutral-200 pb-5 dark:border-neutral-800 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-serif text-4xl font-bold text-primary">Curriculum Vitae</h1>
            {/* <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              The embedded PDF below is the downloadable version of my CV.
            </p> */}
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={cvPath}
              download
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-4 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
            >
              <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
              Download PDF
            </a>
            <a
              href={cvPath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-neutral-200 px-4 text-sm font-medium text-neutral-700 transition-colors hover:border-accent hover:text-accent dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-700 dark:hover:border-accent"
            >
              <ArrowTopRightOnSquareIcon className="mr-2 h-4 w-4" />
              Open PDF
            </a>
          </div>
        </header>

        <section className="overflow-hidden border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <iframe
            title="Rong Zou CV PDF"
            src={`${cvPath}#toolbar=1&navpanes=0`}
            className="h-[calc(100vh-13rem)] min-h-[36rem] w-full"
          />
        </section>
      </div>
    </div>
  );
}
