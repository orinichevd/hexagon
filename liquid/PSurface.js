class PSurface {
    objects;
    fields;

    constructor() {
        this.objects = [];
        this.fields = [];
    }

    add(o) {
        this.objects.push(o);
    }

    addField(field) {
        this.fields.push(field);
    }

    update() {
        this.objects.forEach(object => {
            this.fields.forEach(field => {
                field.attract(object);
            });
            object.update();
        });

    }
}