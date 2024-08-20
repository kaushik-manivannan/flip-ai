import { BoltIcon, BookmarkIcon, BookOpenIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import { FC } from 'react';
import landingPage from '@/public/landing-page.png';

const features = [
  {
    name: 'Generate Flashcards Instantly',
    description:
      'Turn any idea, topic, or prompt into powerful flashcards in just seconds. No more manual creation—just input, flip, and learn!',
    icon: BoltIcon,
  },
  {
    name: 'Seamless Learning Experience',
    description:
      'Access your flashcards anytime, anywhere. Flip AI ensures your learning journey is smooth, engaging, and effective.',
    icon: BookOpenIcon,
  },
  {
    name: 'Save and Revisit',
    description: 'Save your flashcards for future reference and keep your knowledge organized. Learning is a journey—Flip AI helps you stay on track.',
    icon: BookmarkIcon,
  },
]

interface FeaturesPageProps {
  
}
 
const FeaturesPage: FC<FeaturesPageProps> = () => {
  return (
    <div className="overflow-hidden" id="features">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-32 mb:py-48 lg:mb-56">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-primary sm:text-6xl text-center mb-7">Features</h2>
        <div className="mx-auto grid justify-center items-center max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-foreground sm:text-4xl">Your Ultimate Flashcard Companion</p>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-foreground">
                Flip AI transforms the way you learn by generating custom flashcards from topics of your choice in seconds. Our app is designed to make learning faster, easier, and more enjoyable. Here&apos;s what you&apos;ll love about Flip AI:
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900 dark:text-primary">
                      <feature.icon aria-hidden="true" className="absolute left-1 top-1 h-5 w-5 text-indigo-600 dark:text-primary" />
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline dark:text-foreground">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <Image
            alt="Flip AI in action"
            src={landingPage}
            className="w-[40rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[66rem] md:-ml-4 lg:-ml-0"
          />
        </div>
      </div>
    </div>
  );
}
 
export default FeaturesPage;