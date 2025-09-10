import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import AdultAdhdAssessmentFlow from './components/AdultAdhdAssessmentFlow';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'adultAdhdAssessment.metadata' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      type: 'website',
    },
    alternates: {
      canonical: `/${locale}/adult-adhd-assessment`,
      languages: {
        'zh': '/zh/adult-adhd-assessment',
        'en': '/en/adult-adhd-assessment',
      },
    },
  };
}

export default function AdultAdhdAssessmentPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <AdultAdhdAssessmentFlow />
    </div>
  );
}