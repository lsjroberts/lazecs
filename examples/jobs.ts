import {
  App,
  type Commands,
  DefaultPlugins,
  query,
  has,
  without,
} from "../src/lazecs";

// ---

function main() {
  new App().add_plugin(PeoplePlugin).run();
}

class PeoplePlugin {
  build(app: App) {
    app
      .add_startup_system(setup)
      .add_system(print_names)
      .add_system(people_with_jobs)
      .add_system(people_ready_for_hire)
      .add_system(person_does_job);
  }
}

class Person {
  name!: string;
}

class Employed {
  job!: Job;
}

enum Job {
  Lawyer = "lawyer",
  Doctor = "doctor",
  FireFighter = "firefighter",
}

function setup(commands: Commands) {
  commands.spawn([Person, { name: "Alice" }], [Employed, { job: Job.Doctor }]);
  commands.spawn([Person, { name: "Bob" }], [Employed, { job: Job.Lawyer }]);
  commands.spawn([Person, { name: "Charlie" }]);
}

function print_names(people = query(Person)) {
  for (const person of people) {
    console.log(person.name);
  }
}

function people_with_jobs(people = query(Person, has(Employed))) {
  for (const person of people) {
    console.log(`${person.name} has a job`);
  }
}

function people_ready_for_hire(people = query(Person, without(Employed))) {
  for (const person of people) {
    console.log(`${person.name} is ready for hire`);
  }
}

function person_does_job(people = query([Person, Employed])) {
  for (const [person, employed] of people) {
    console.log(`${person.name} is a ${employed.job}`);
  }
}

console.log("---------");
main();
