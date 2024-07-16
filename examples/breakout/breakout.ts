import {
    App,
    Ctr,
    DefaultPlugins,
    FixedUpdate,
    Resource,
    Startup,
    Update,
    Vec2,
} from '../../src';

function main() {
    new App()
        .add_plugin(DefaultPlugins)
        .insert_resource(Score, 'asf')
        .insert_resource(ClearColor, Color.srgb(0.9, 0.9, 0.9))
        .add_systems(Startup, setup)
        .add_systems(
            FixedUpdate,
            chain(
                apply_velocity,
                move_paddle,
                check_for_collisions,
                play_collision_sound
            )
        )
        .add_systems(Update, update_scoreboard)
        .run();
}

class Paddle {}

class Ball {}

@Vec2
class Velocity {}

class Collider {}

class CollisionEvent {}

class Brick {}

@(Resource<Handle<AudioSource>>)
class CollisionSound {}

@(Resource<number>)
class Score {}

class ScoreboardUi {}

@Bundle
class WallBundle {
    sprite_bundle: SpriteBundle;
    collider: Collider;

    constructor(location: WallLocation) {
        this.sprite_bundle = new SpriteBundle();
        this.sprite_bundle.transform.translation = location
            .position()
            .extend(0.0);
        this.sprite_bundle.transform.scale = location.size().extend(1.0);
        this.sprite_bundle.sprite.color = WALL_COLOR;
        this.collider = new Collider();
    }
}

enum WallLocation {
    Left,
    Right,
    Bottom,
    Top,
}

function setup(
    cmds = commands(),
    meshes = resource(assets(Mesh)),
    materials = resource(assets(ColorMaterial)),
    asset_server = resource(AssetServer)
) {
    cmds.spawn(Camera2dBundle);

    cmds.spawn(SpriteBundle);
}
