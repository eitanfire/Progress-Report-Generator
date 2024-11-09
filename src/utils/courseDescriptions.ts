interface CourseDescription {
  name: string;
  emoji: string;
  description: string;
  possibleCredits: number;
}

const courseDescriptions: { [key: string]: CourseDescription } = {
  "world history": {
    name: "World History",
    emoji: "🗺️",
    description:
      "From prehistory to the present, this class will explore the events that changed our world. In this course, we will work forward chronologically to understand the pivotal aspects of history as well as consider the study of history itself.",
    possibleCredits: 4,
  },
  technology: {
    name: "Technology",
    emoji: "📱",
    description:
      "In this course, students will explore the profound impact of technology on society and examine how it has evolved. Through engaging discussions, projects, and hands-on activities, we will learn about our own personal connections to technology and how to embrace new advancements in a healthy manner.",
    possibleCredits: 4,
  },
  government: {
    name: "Government",
    emoji: "🗽",
    description:
      "Students will study the American government's purposes, principles, and practices as established by the Constitution. Students are expected to understand their rights and responsibilities as citizens and how to exercise these rights and responsibilities in local, state, and national government. Students will learn the structure and processes of the state of Colorado's government and various local governments.",
    possibleCredits: 4,
  },
};

export default courseDescriptions;
