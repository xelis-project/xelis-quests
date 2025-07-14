export class ElementMatrix {
    element: HTMLElement;

    static new_matrix(transform?: string) {
        return new (window.WebKitCSSMatrix || window.DOMMatrix)(transform);
    }

    constructor(element: HTMLElement) {
        this.element = element;
    }

    get_transform_matrix() {
        let transform_matrix = ElementMatrix.new_matrix();

        let element = this.element;
        while (element != undefined && element !== document.documentElement) {
            let style = window.getComputedStyle(element);
            let css_matrix = ElementMatrix.new_matrix(style.transform);
            transform_matrix = css_matrix.multiply(transform_matrix);
            element = element.parentNode as HTMLDivElement;
        }

        let w = this.element.offsetWidth;
        let h = this.element.offsetHeight;
        let p1 = this.point_transform(transform_matrix, 0, 0, 0);
        let p2 = this.point_transform(transform_matrix, w, 0, 0);
        let p3 = this.point_transform(transform_matrix, w, h, 0);
        let p4 = this.point_transform(transform_matrix, 0, h, 0);
        let left = Math.min(p1.x, p2.x, p3.x, p4.x);
        let top = Math.min(p1.y, p2.y, p3.y, p4.y);

        let rect = this.element.getBoundingClientRect();
        transform_matrix = ElementMatrix.new_matrix().translate(
            window.scrollX + rect.left - left,
            window.scrollY + rect.top - top,
            0).multiply(transform_matrix);

        return transform_matrix;
    }

    get_world_point(screen_x: number, screen_y: number) {
        let transform_matrix = this.get_transform_matrix();
        return this.point_transform(transform_matrix.inverse(), screen_x, screen_y, 0);
    }

    get_screen_point(element_x: number, element_y: number) {
        let transform_matrix = this.get_transform_matrix();
        return this.point_transform(transform_matrix, element_x, element_y, 0);
    }

    point_transform(matrix: WebKitCSSMatrix, x: number, y: number, z: number) {
        let m = matrix.multiply(ElementMatrix.new_matrix().translate(x, y, z));
        return { x: m.m41, y: m.m42, z: m.m43 };
    }
}
