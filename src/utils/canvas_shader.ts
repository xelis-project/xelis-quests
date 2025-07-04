import * as THREE from 'three';

type Uniforms = { [uniform: string]: THREE.IUniform<any> };

export class CanvasShader {
    canvas: HTMLCanvasElement;
    renderer: THREE.WebGLRenderer;
    camera: THREE.OrthographicCamera;
    scene: THREE.Scene;
    uniforms: Uniforms;

    constructor(fragment_shader: string, uniforms?: Uniforms) {
        this.canvas = document.createElement(`canvas`);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvas });
        this.renderer.autoClearColor = false;

        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
        this.scene = new THREE.Scene();

        const plane = new THREE.PlaneGeometry(2, 2);

        this.uniforms = {
            // shadertoy
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector3() },
            // glsl
            u_time: { value: 0 },
            u_resolution: { value: new THREE.Vector2(innerWidth, innerHeight) },
            ...uniforms
        };

        const material = new THREE.ShaderMaterial({
            fragmentShader: fragment_shader,
            uniforms: this.uniforms
        });

        this.scene.add(new THREE.Mesh(plane, material));
        requestAnimationFrame(this.render);
    }

    render = (time: number) => {
        this.resize();

        time *= 0.001;

        this.uniforms.iResolution.value.set(this.canvas.width, this.canvas.height, 1);
        this.uniforms.iTime.value = time;

        this.uniforms.u_resolution.value.set(this.canvas.width, this.canvas.height);
        this.uniforms.u_time.value = time;

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render);
    }

    resize = () => {
        const canvas = this.renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        this.renderer.setSize(width, height, false);
    }
}