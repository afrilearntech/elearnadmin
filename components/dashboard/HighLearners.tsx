"use client";

interface Learner {
  initials: string;
  name: string;
  achievement: string;
}

const learners: Learner[] = [
  {
    initials: "BJ",
    name: "Bertha Jones",
    achievement: "Completed 8 quizzes this week",
  },
  {
    initials: "PS",
    name: "Prince Samuel",
    achievement: "Achieved 95% in maths subject",
  },
  {
    initials: "JO",
    name: "Josephine Osei",
    achievement: "Top Score in Science Project",
  },
  {
    initials: "SO",
    name: "Sarah Opoku",
    achievement: 'Finished "History of Art" Course',
  },
  {
    initials: "MJ",
    name: "MaryAnn Jones",
    achievement: "Completed 8 quizzes this week",
  },
];

export default function HighLearners() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">High Learners</h2>
      <div className="space-y-4">
        {learners.map((learner, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#059669] to-[#1E40AF] flex items-center justify-center text-white font-semibold">
              {learner.initials}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{learner.name}</p>
              <p className="text-sm text-gray-600">{learner.achievement}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

