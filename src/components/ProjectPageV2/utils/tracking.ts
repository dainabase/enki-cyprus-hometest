declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
  console.log('[Analytics]', eventName, params);
};

export const trackScrollDepth = (percentage: number) => {
  trackEvent('scroll_depth', {
    percent: percentage,
    timestamp: new Date().toISOString()
  });
};

export const trackCTAClick = (ctaText: string, ctaLocation: string) => {
  trackEvent('cta_click', {
    cta_text: ctaText,
    cta_location: ctaLocation,
    timestamp: new Date().toISOString()
  });
};

export const trackFormStart = (formId: string) => {
  trackEvent('form_start', {
    form_id: formId,
    timestamp: new Date().toISOString()
  });
};

export const trackFormFieldComplete = (formId: string, fieldName: string) => {
  trackEvent('form_field_complete', {
    form_id: formId,
    field_name: fieldName
  });
};

export const trackFormSubmit = (formId: string, formData?: Record<string, any>) => {
  trackEvent('form_submit', {
    form_id: formId,
    ...formData,
    timestamp: new Date().toISOString()
  });
};

export const trackFormAbandonment = (formId: string, lastField: string) => {
  trackEvent('form_abandonment', {
    form_id: formId,
    last_field: lastField,
    timestamp: new Date().toISOString()
  });
};

export const trackVideoPlay = (videoId: string) => {
  trackEvent('video_play', { video_id: videoId });
};

export const trackVideoProgress = (videoId: string, percent: number) => {
  trackEvent('video_progress', {
    video_id: videoId,
    percent: percent
  });
};

export const trackGalleryView = (imageIndex: number, totalImages: number) => {
  trackEvent('gallery_view', {
    image_index: imageIndex,
    total_images: totalImages
  });
};

export const trackPlanDownload = (planType: string) => {
  trackEvent('plan_download', {
    plan_type: planType,
    timestamp: new Date().toISOString()
  });
};

export const trackVirtualTourLaunch = () => {
  trackEvent('virtual_tour_launch', {
    timestamp: new Date().toISOString()
  });
};

export const track360View = () => {
  trackEvent('360_view_launch', {
    timestamp: new Date().toISOString()
  });
};

export const trackPhoneClick = (phoneNumber: string) => {
  trackEvent('phone_click', {
    phone_number: phoneNumber,
    timestamp: new Date().toISOString()
  });
};

export const trackWhatsAppClick = () => {
  trackEvent('whatsapp_click', {
    timestamp: new Date().toISOString()
  });
};

export const trackEmailClick = (emailAddress: string) => {
  trackEvent('email_click', {
    email_address: emailAddress,
    timestamp: new Date().toISOString()
  });
};

export const trackSectionView = (sectionName: string) => {
  trackEvent('section_view', {
    section_name: sectionName,
    timestamp: new Date().toISOString()
  });
};
