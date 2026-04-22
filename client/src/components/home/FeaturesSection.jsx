import { MdAllInclusive, MdCelebration, MdGroups, MdHistory } from "react-icons/md";

const featureIcons = {
  history: MdHistory,
  groups: MdGroups,
  all_inclusive: MdAllInclusive,
  celebration: MdCelebration,
};

const features = [
  {
    "_id": "0",
    "title": "20+ Years",
    "description": "Serving happiness since two decades",
    "icon": "history",
    "iconClasses": "bg-primary-container text-on-primary-container shadow-primary-container/30",
  },
  {
    "_id": "1",
    "title": "1000+ Customers",
    "description": "Families who trust us for every joy",
    "icon": "groups",
    "iconClasses": "bg-secondary-container text-on-secondary-container shadow-secondary-container/30",
    "filled": false,
    "sortOrder": 2,
    "__v": 0,
    "createdAt": "2026-04-16T18:56:05.909Z",
    "updatedAt": "2026-04-16T18:56:05.909Z"
  },
  {
    "_id": "2",
    "title": "Infinite Variety",
    "description": "Something special for everyone",
    "icon": "all_inclusive",
    "iconClasses": "bg-tertiary-container text-on-tertiary-container shadow-tertiary-container/30",
    "filled": false,
    "sortOrder": 3,
    "__v": 0,
    "createdAt": "2026-04-16T18:56:05.909Z",
    "updatedAt": "2026-04-16T18:56:05.909Z"
  },
  {
    "_id": "3",
    "title": "Happy Prices",
    "description": "Magical gifts without breaking banks",
    "icon": "celebration",
    "iconClasses": "bg-primary-container text-on-primary-container shadow-primary-container/30",
    "filled": true,
    "sortOrder": 4,
    "__v": 0,
    "createdAt": "2026-04-16T18:56:05.909Z",
    "updatedAt": "2026-04-16T18:56:05.909Z"
  }
]

export default function FeaturesSection() {
  return (
    <section className="relative mx-4 mt-12 overflow-hidden rounded-xl bg-surface-container-low p-6 sm:mx-6 sm:p-8 lg:mx-auto lg:mt-16 lg:max-w-7xl lg:px-10 lg:py-12">
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary-container/20 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-secondary-container/20 blur-3xl" />

      <h3 className="motion-rise mb-10 text-center font-headline text-3xl font-black leading-tight text-primary sm:text-4xl lg:text-5xl">
        Why We&apos;re
        <br />
        Extraordinary
      </h3>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
        {features.map((feature) => {
          const Icon = featureIcons[feature.icon] || MdCelebration;

          return (
            <div key={feature.title} className="hover-lift rounded-[1.8rem] bg-white/72 p-5 shadow-[0_20px_40px_-32px_rgba(31,41,55,0.35)] backdrop-blur-sm transition-colors duration-300 hover:bg-white">
              <div className="flex items-center gap-6">
                <div className={`motion-float-medium flex h-16 w-16 shrink-0 items-center justify-center rounded-full shadow-lg ${feature.iconClasses}`}>
                  <Icon className="text-3xl" />
                </div>
                <div>
                  <h4 className="font-headline text-2xl font-bold text-on-surface">{feature.title}</h4>
                  <p className="text-sm font-medium text-on-surface-variant">{feature.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
