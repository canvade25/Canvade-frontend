import React, { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useFadeInAnimation,
  useBackgroundRotation,
  useFormState,
} from './hooks/useHeroHooks';
import { HERO_IMAGES } from './constants/heroConstants';
import HeroContainer from './components/HeroContainer';
import SocialBar from './components/SocialBar';
import ScrollToTopButton from './components/ScrollToTopButton';

function validateFormData(formData) {
  const errors = {};
  if (!formData.programs?.trim()) {
    errors.programs = 'Please select a program or institution';
  }
  if (!formData.location?.trim()) {
    errors.location = 'Please enter a location';
  }
  return errors;
}

function HomeHero() {
  const navigate = useNavigate();
  const isVisible = useFadeInAnimation();
  const { currentIndex: currentImageIndex, isFading } = useBackgroundRotation(HERO_IMAGES);

  const initialFormState = useMemo(
    () => ({
      programs: '',
      location: '',
      searchFor: '',
      feeRange: '',
      learningMode: '',
      courseDuration: '',
    }),
    []
  );

  const { formData, errors, touched, handleChange, handleBlur, reset } =
    useFormState(initialFormState);

  const handleFormSubmit = useCallback(() => {
    const validationErrors = validateFormData(formData);
    if (Object.keys(validationErrors).length > 0) {
      console.error('Form validation failed:', validationErrors);
      return;
    }
    const queryParams = new URLSearchParams();
    if (formData.programs) queryParams.append('q', formData.programs);
    if (formData.searchFor) queryParams.append('searchFor', formData.searchFor);
    if (formData.feeRange) queryParams.append('feeRange', formData.feeRange);
    if (formData.learningMode) queryParams.append('learningMode', formData.learningMode);
    if (formData.courseDuration) queryParams.append('courseDuration', formData.courseDuration);
    navigate(`/search?${queryParams.toString()}`);
    reset();
  }, [formData, navigate, reset]);

  const memoizedHandleChange = useCallback(handleChange, [handleChange]);
  const memoizedHandleBlur = useCallback(handleBlur, [handleBlur]);
  const memoizedHandleSubmit = useCallback(handleFormSubmit, [handleFormSubmit]);

  return (
    <>
      <section className="bg-white pt-[4.5rem] sm:pt-[4.75rem] md:pt-[5rem] pb-2 sm:pb-4 transition-all duration-200">
        <div className="mx-auto relative w-full max-w-[1700px] px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-2 sm:py-3">
          {/* Social Bar — desktop only */}
          <div className="hidden lg:block">
            <SocialBar />
          </div>

          <HeroContainer
            currentImageIndex={currentImageIndex}
            isFading={isFading}
            isVisible={isVisible}
            formData={formData}
            errors={errors}
            touched={touched}
            onFieldChange={memoizedHandleChange}
            onFieldBlur={memoizedHandleBlur}
            onFormSubmit={memoizedHandleSubmit}
          />
        </div>
      </section>

      <ScrollToTopButton />
    </>
  );
}

export default HomeHero;