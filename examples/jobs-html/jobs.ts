import {
    App,
    Html,
    Startup,
    Update,
    commands,
    has,
    query,
    without,
} from '../../src';

function main() {
    new App().add_plugin(PeoplePlugin).run();
}

class PeoplePlugin {
    build(app: App) {
        app.add_plugin(Html.HtmlPlugins)
            .add_systems(Startup, setup)
            .add_systems(
                Startup,
                // print_names
                // people_with_jobs,
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
    cmds.spawn(
        [Person, { name: 'Alice' }],
        [Employed, { job: Job.Doctor }],
        [Html.Element, { tag: 'div', children: [] }]
    );
    cmds.spawn(
        [Person, { name: 'Bob' }],
        [Employed, { job: Job.Lawyer }],
        [Html.Element, { tag: 'div', children: [] }]
    );
    cmds.spawn(
        [Person, { name: 'Charlie' }],
        [Html.Element, { tag: 'div', children: [] }]
    );
}

function people_ready_for_hire(
    people = query([Person, Html.Element], without(Employed))
) {
    for (const [person, element] of people) {
        element.children = [`${person.name} is ready for hire`];
    }
}

function person_does_job(people = query([Person, Employed, Html.Element])) {
    for (const [person, employed, element] of people) {
        element.children = [`${person.name} is a ${employed.job}`];
    }
}

main();
