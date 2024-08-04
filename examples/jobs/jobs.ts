import { App, Startup, Update, commands, has, query, without } from '../../src';

function main() {
    new App().add_plugin(PeoplePlugin).run();
}

class PeoplePlugin {
    build(app: App) {
        app.add_systems(Startup, setup).add_systems(
            Update,
            print_names,
            people_with_jobs,
            people_ready_for_hire,
            person_does_job
        );
    }
}

class Person {
    name!: string;
}

class Employed {
    job!: Job;
}

enum Job {
    Lawyer = 'lawyer',
    Doctor = 'doctor',
    FireFighter = 'firefighter',
}

function setup(cmds = commands()) {
    cmds.spawn([Person, { name: 'Alice' }], [Employed, { job: Job.Doctor }]);
    cmds.spawn([Person, { name: 'Bob' }], [Employed, { job: Job.Lawyer }]);
    cmds.spawn([Person, { name: 'Charlie' }]);
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

console.log('---------');
main();
