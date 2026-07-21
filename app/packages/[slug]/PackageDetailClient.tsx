'use client'

import { useState } from 'react'
import { useEnquiry } from '../../context/EnquiryContext'
import styles from '../packages.module.css'

export default function PackageDetailClient({ pkg }: { pkg: any }) {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const { openModal } = useEnquiry()

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>{pkg.title}</h1>
        {pkg.description && <p className={styles.heroDesc}>{pkg.description}</p>}
      </section>

      <div className={styles.toggleContainer}>
        <button 
          className={`${styles.toggleBtn} ${billing === 'monthly' ? styles.toggleBtnActive : ''}`}
          onClick={() => setBilling('monthly')}
        >
          Monthly
        </button>
        <button 
          className={`${styles.toggleBtn} ${billing === 'yearly' ? styles.toggleBtnActive : ''}`}
          onClick={() => setBilling('yearly')}
        >
          Yearly (20% Off)
        </button>
      </div>

      <div className={styles.grid}>
        {pkg.plans.map((plan: any, i: number) => (
          <div key={i} className={`${styles.card} ${plan.isPopular ? styles.cardPopular : ''}`}>
            <h2 className={styles.planName}>{plan.name}</h2>
            <div className={styles.priceWrap}>
              <span className={styles.currency}>₹</span>
              <span className={styles.amount}>
                {billing === 'monthly' ? plan.priceMonthly : plan.priceYearly}
              </span>
              <span className={styles.period}>/{billing === 'monthly' ? 'month' : 'year'}</span>
            </div>

            <ul className={styles.features}>
              {plan.features.map((feat: string, fi: number) => (
                <li key={fi} className={styles.featureItem}>{feat}</li>
              ))}
            </ul>

            <button className={styles.ctaBtn} onClick={() => openModal()}>
              {plan.ctaText || 'Enquiry Now'}
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}
