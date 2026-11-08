// Run: node examples/day-01/02-employee-summary.js

const employeeName = "Saurabh";
const experienceYears = 2;
const primarySkill = "JavaScript";
let completedTasks = 4;

completedTasks += 1;

const summary = `${employeeName} has ${experienceYears} years of experience.
Primary skill: ${primarySkill}.
Completed tasks today: ${completedTasks}.`;

console.log(summary);
