// ThreeExtras.js r47 - http://github.com/mrdoob/three.js
'use strict';
THREE.ColorUtils = {
    adjustHSV: function(a, b, c, d) {
        var f = THREE.ColorUtils.__hsv;
        THREE.ColorUtils.rgbToHsv(a, f);
        f.h = THREE.Math.clamp(f.h + b, 0, 1);
        f.s = THREE.Math.clamp(f.s + c, 0, 1);
        f.v = THREE.Math.clamp(f.v + d, 0, 1);
        a.setHSV(f.h, f.s, f.v)
    },
    rgbToHsv: function(a, b) {
        var c = a.r,
            d = a.g,
            f = a.b,
            g = Math.max(Math.max(c, d), f),
            e = Math.min(Math.min(c, d), f);
        if (e === g) e = c = 0;
        else {
            var h = g - e,
                e = h / g,
                c = (c === g ? (d - f) / h : d === g ? 2 + (f - c) / h : 4 + (c - d) / h) / 6;
            0 > c && (c += 1);
            1 < c && (c -= 1)
        }
        void 0 === b && (b = {
            h: 0,
            s: 0,
            v: 0
        });
        b.h = c;
        b.s = e;
        b.v = g;
        return b
    }
};
THREE.ColorUtils.__hsv = {
    h: 0,
    s: 0,
    v: 0
};
THREE.GeometryUtils = {
    merge: function(a, b) {
        for (var c, d, f = a.vertices.length, g = b instanceof THREE.Mesh ? b.geometry : b, e = a.vertices, h = g.vertices, i = a.faces, k = g.faces, j = a.faceVertexUvs[0], m = g.faceVertexUvs[0], p = {}, n = 0; n < a.materials.length; n++) p[a.materials[n].id] = n;
        if (b instanceof THREE.Mesh) b.matrixAutoUpdate && b.updateMatrix(), c = b.matrix, d = new THREE.Matrix4, d.extractRotation(c, b.scale);
        for (var n = 0, l = h.length; n < l; n++) {
            var o = new THREE.Vertex(h[n].position.clone());
            c && c.multiplyVector3(o.position);
            e.push(o)
        }
        for (n = 0, l = k.length; n < l; n++) {
            var e = k[n],
                q, r, s = e.vertexNormals,
                t = e.vertexColors;
            e instanceof THREE.Face3 ? q = new THREE.Face3(e.a + f, e.b + f, e.c + f) : e instanceof THREE.Face4 && (q = new THREE.Face4(e.a + f, e.b + f, e.c + f, e.d + f));
            q.normal.copy(e.normal);
            d && d.multiplyVector3(q.normal);
            h = 0;
            for (o = s.length; h < o; h++) r = s[h].clone(), d && d.multiplyVector3(r), q.vertexNormals.push(r);
            q.color.copy(e.color);
            h = 0;
            for (o = t.length; h < o; h++) r = t[h], q.vertexColors.push(r.clone());
            if (void 0 !== e.materialIndex) {
                h = g.materials[e.materialIndex];
                o = h.id;
                t = p[o];
                if (void 0 === t) t = a.materials.length, p[o] = t, a.materials.push(h);
                q.materialIndex = t
            }
            q.centroid.copy(e.centroid);
            c && c.multiplyVector3(q.centroid);
            i.push(q)
        }
        for (n = 0, l = m.length; n < l; n++) {
            c = m[n];
            d = [];
            h = 0;
            for (o = c.length; h < o; h++) d.push(new THREE.UV(c[h].u, c[h].v));
            j.push(d)
        }
    },
    clone: function(a) {
        var b = new THREE.Geometry,
            c, d = a.vertices,
            f = a.faces,
            g = a.faceVertexUvs[0];
        if (a.materials) b.materials = a.materials.slice();
        for (a = 0, c = d.length; a < c; a++) {
            var e = new THREE.Vertex(d[a].position.clone());
            b.vertices.push(e)
        }
        for (a = 0, c = f.length; a < c; a++) {
            var h = f[a],
                i, k, j = h.vertexNormals,
                m = h.vertexColors;
            h instanceof THREE.Face3 ? i = new THREE.Face3(h.a, h.b, h.c) : h instanceof THREE.Face4 && (i = new THREE.Face4(h.a, h.b, h.c, h.d));
            i.normal.copy(h.normal);
            d = 0;
            for (e = j.length; d < e; d++) k = j[d], i.vertexNormals.push(k.clone());
            i.color.copy(h.color);
            d = 0;
            for (e = m.length; d < e; d++) k = m[d], i.vertexColors.push(k.clone());
            i.materialIndex = h.materialIndex;
            i.centroid.copy(h.centroid);
            b.faces.push(i)
        }
        for (a = 0, c = g.length; a < c; a++) {
            f = g[a];
            i = [];
            d = 0;
            for (e = f.length; d < e; d++) i.push(new THREE.UV(f[d].u, f[d].v));
            b.faceVertexUvs[0].push(i)
        }
        return b
    },
    randomPointInTriangle: function(a, b, c) {
        var d, f, g, e = new THREE.Vector3,
            h = THREE.GeometryUtils.__v1;
        d = THREE.GeometryUtils.random();
        f = THREE.GeometryUtils.random();
        1 < d + f && (d = 1 - d, f = 1 - f);
        g = 1 - d - f;
        e.copy(a);
        e.multiplyScalar(d);
        h.copy(b);
        h.multiplyScalar(f);
        e.addSelf(h);
        h.copy(c);
        h.multiplyScalar(g);
        e.addSelf(h);
        return e
    },
    randomPointInFace: function(a, b, c) {
        var d, f, g;
        if (a instanceof THREE.Face3) return d = b.vertices[a.a].position, f = b.vertices[a.b].position, g = b.vertices[a.c].position, THREE.GeometryUtils.randomPointInTriangle(d, f, g);
        if (a instanceof THREE.Face4) {
            d = b.vertices[a.a].position;
            f = b.vertices[a.b].position;
            g = b.vertices[a.c].position;
            var b = b.vertices[a.d].position,
                e;
            c ? a._area1 && a._area2 ? (c = a._area1, e = a._area2) : (c = THREE.GeometryUtils.triangleArea(d, f, b), e = THREE.GeometryUtils.triangleArea(f, g, b), a._area1 = c, a._area2 = e) : (c = THREE.GeometryUtils.triangleArea(d, f, b), e = THREE.GeometryUtils.triangleArea(f, g, b));
            return THREE.GeometryUtils.random() * (c + e) < c ? THREE.GeometryUtils.randomPointInTriangle(d, f, b) : THREE.GeometryUtils.randomPointInTriangle(f, g, b)
        }
    },
    randomPointsInGeometry: function(a, b) {
        function c(a) {
            function b(c, d) {
                if (d < c) return c;
                var f = c + Math.floor((d - c) / 2);
                return k[f] > a ? b(c, f - 1) : k[f] < a ? b(f + 1, d) : f
            }
            return b(0, k.length - 1)
        }
        var d, f, g = a.faces,
            e = a.vertices,
            h = g.length,
            i = 0,
            k = [],
            j, m, p, n;
        for (f = 0; f < h; f++) {
            d = g[f];
            if (d instanceof THREE.Face3) j = e[d.a].position, m = e[d.b].position, p = e[d.c].position, d._area = THREE.GeometryUtils.triangleArea(j, m, p);
            else if (d instanceof
            THREE.Face4) j = e[d.a].position, m = e[d.b].position, p = e[d.c].position, n = e[d.d].position, d._area1 = THREE.GeometryUtils.triangleArea(j, m, n), d._area2 = THREE.GeometryUtils.triangleArea(m, p, n), d._area = d._area1 + d._area2;
            i += d._area;
            k[f] = i
        }
        d = [];
        for (f = 0; f < b; f++) e = THREE.GeometryUtils.random() * i, e = c(e), d[f] = THREE.GeometryUtils.randomPointInFace(g[e], a, !0);
        return d
    },
    triangleArea: function(a, b, c) {
        var d, f = THREE.GeometryUtils.__v1;
        f.sub(a, b);
        d = f.length();
        f.sub(a, c);
        a = f.length();
        f.sub(b, c);
        c = f.length();
        b = 0.5 * (d + a + c);
        return Math.sqrt(b * (b - d) * (b - a) * (b - c))
    },
    center: function(a) {
        a.computeBoundingBox();
        var b = a.boundingBox,
            c = new THREE.Vector3;
        c.add(b.min, b.max);
        c.multiplyScalar(-0.5);
        a.applyMatrix((new THREE.Matrix4).setTranslation(c.x, c.y, c.z));
        a.computeBoundingBox();
        return c
    },
    normalizeUVs: function(a) {
        for (var a = a.faceVertexUvs[0], b = 0, c = a.length; b < c; b++) for (var d = a[b], f = 0, g = d.length; f < g; f++) 1 !== d[f].u && (d[f].u -= Math.floor(d[f].u)), 1 !== d[f].v && (d[f].v -= Math.floor(d[f].v))
    }
};
THREE.GeometryUtils.random = THREE.Math.random16;
THREE.GeometryUtils.__v1 = new THREE.Vector3;
THREE.ImageUtils = {
    crossOrigin: "",
    loadTexture: function(a, b, c) {
        var d = new Image,
            f = new THREE.Texture(d, b);
        d.onload = function() {
            f.needsUpdate = !0;
            c && c(this)
        };
        d.crossOrigin = this.crossOrigin;
        d.src = a;
        return f
    },
    loadTextureCube: function(a, b, c) {
        var d, f = [],
            g = new THREE.Texture(f, b);
        f.loadCount = 0;
        for (b = 0, d = a.length; b < d; ++b) f[b] = new Image, f[b].onload = function() {
            f.loadCount += 1;
            if (6 === f.loadCount) g.needsUpdate = !0;
            c && c(this)
        }, f[b].crossOrigin = "", f[b].src = a[b];
        return g
    },
    getNormalMap: function(a, b) {
        var c = function(a) {
                var b = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
                return [a[0] / b, a[1] / b, a[2] / b]
            },
            b = b | 1,
            d = a.width,
            f = a.height,
            g = document.createElement("canvas");
        g.width = d;
        g.height = f;
        var e = g.getContext("2d");
        e.drawImage(a, 0, 0);
        for (var h = e.getImageData(0, 0, d, f).data, i = e.createImageData(d, f), k = i.data, j = 0; j < d; j++) for (var m = 1; m < f; m++) {
            var p = 0 > m - 1 ? f - 1 : m - 1,
                n = (m + 1) % f,
                l = 0 > j - 1 ? d - 1 : j - 1,
                o = (j + 1) % d,
                q = [],
                r = [0, 0, h[4 * (m * d + j)] / 255 * b];
            q.push([-1, 0, h[4 * (m * d + l)] / 255 * b]);
            q.push([-1, -1, h[4 * (p * d + l)] / 255 * b]);
            q.push([0, -1, h[4 * (p * d + j)] / 255 * b]);
            q.push([1, -1, h[4 * (p * d + o)] / 255 * b]);
            q.push([1, 0, h[4 * (m * d + o)] / 255 * b]);
            q.push([1, 1, h[4 * (n * d + o)] / 255 * b]);
            q.push([0, 1, h[4 * (n * d + j)] / 255 * b]);
            q.push([-1, 1, h[4 * (n * d + l)] / 255 * b]);
            p = [];
            l = q.length;
            for (n = 0; n < l; n++) {
                var o = q[n],
                    s = q[(n + 1) % l],
                    o = [o[0] - r[0], o[1] - r[1], o[2] - r[2]],
                    s = [s[0] - r[0], s[1] - r[1], s[2] - r[2]];
                p.push(c([o[1] * s[2] - o[2] * s[1], o[2] * s[0] - o[0] * s[2], o[0] * s[1] - o[1] * s[0]]))
            }
            q = [0, 0, 0];
            for (n = 0; n < p.length; n++) q[0] += p[n][0], q[1] += p[n][1], q[2] += p[n][2];
            q[0] /= p.length;
            q[1] /= p.length;
            q[2] /= p.length;
            r = 4 * (m * d + j);
            k[r] = 255 * ((q[0] + 1) / 2) | 0;
            k[r + 1] = 255 * (q[1] + 0.5) | 0;
            k[r + 2] = 255 * q[2] | 0;
            k[r + 3] = 255
        }
        e.putImageData(i, 0, 0);
        return g
    }
};
THREE.SceneUtils = {
    showHierarchy: function(a, b) {
        THREE.SceneUtils.traverseHierarchy(a, function(a) {
            a.visible = b
        })
    },
    traverseHierarchy: function(a, b) {
        var c, d, f = a.children.length;
        for (d = 0; d < f; d++) c = a.children[d], b(c), THREE.SceneUtils.traverseHierarchy(c, b)
    },
    createMultiMaterialObject: function(a, b) {
        var c, d = b.length,
            f = new THREE.Object3D;
        for (c = 0; c < d; c++) {
            var g = new THREE.Mesh(a, b[c]);
            f.add(g)
        }
        return f
    },
    cloneObject: function(a) {
        var b;
        a instanceof THREE.MorphAnimMesh ? (b = new THREE.MorphAnimMesh(a.geometry, a.material), b.duration = a.duration, b.mirroredLoop = a.mirroredLoop, b.time = a.time, b.lastKeyframe = a.lastKeyframe, b.currentKeyframe = a.currentKeyframe, b.direction = a.direction, b.directionBackwards = a.directionBackwards) : a instanceof THREE.SkinnedMesh ? b = new THREE.SkinnedMesh(a.geometry, a.material) : a instanceof THREE.Mesh ? b = new THREE.Mesh(a.geometry, a.material) : a instanceof THREE.Line ? b = new THREE.Line(a.geometry, a.material, a.type) : a instanceof THREE.Ribbon ? b = new THREE.Ribbon(a.geometry, a.material) : a instanceof THREE.ParticleSystem ? (b = new THREE.ParticleSystem(a.geometry, a.material), b.sortParticles = a.sortParticles) : a instanceof THREE.Particle ? b = new THREE.Particle(a.material) : a instanceof THREE.Sprite ? (b = new THREE.Sprite({}), b.color.copy(a.color), b.map = a.map, b.blending = a.blending, b.useScreenCoordinates = a.useScreenCoordinates, b.mergeWith3D = a.mergeWith3D, b.affectedByDistance = a.affectedByDistance, b.scaleByViewport = a.scaleByViewport, b.alignment = a.alignment, b.rotation3d.copy(a.rotation3d), b.rotation = a.rotation, b.opacity = a.opacity, b.uvOffset.copy(a.uvOffset), b.uvScale.copy(a.uvScale)) : a instanceof THREE.LOD ? b = new THREE.LOD : a instanceof THREE.MarchingCubes ? (b = new THREE.MarchingCubes(a.resolution, a.material), b.field.set(a.field), b.isolation = a.isolation) : a instanceof THREE.Object3D && (b = new THREE.Object3D);
        b.name = a.name;
        b.parent = a.parent;
        b.up.copy(a.up);
        b.position.copy(a.position);
        b.rotation instanceof THREE.Vector3 && b.rotation.copy(a.rotation);
        b.eulerOrder = a.eulerOrder;
        b.scale.copy(a.scale);
        b.dynamic = a.dynamic;
        b.doubleSided = a.doubleSided;
        b.flipSided = a.flipSided;
        b.renderDepth = a.renderDepth;
        b.rotationAutoUpdate = a.rotationAutoUpdate;
        b.matrix.copy(a.matrix);
        b.matrixWorld.copy(a.matrixWorld);
        b.matrixRotationWorld.copy(a.matrixRotationWorld);
        b.matrixAutoUpdate = a.matrixAutoUpdate;
        b.matrixWorldNeedsUpdate = a.matrixWorldNeedsUpdate;
        b.quaternion.copy(a.quaternion);
        b.useQuaternion = a.useQuaternion;
        b.boundRadius = a.boundRadius;
        b.boundRadiusScale = a.boundRadiusScale;
        b.visible = a.visible;
        b.castShadow = a.castShadow;
        b.receiveShadow = a.receiveShadow;
        b.frustumCulled = a.frustumCulled;
        for (var c = 0; c < a.children.length; c++) {
            var d = THREE.SceneUtils.cloneObject(a.children[c]);
            b.children[c] = d;
            d.parent = b
        }
        if (a instanceof THREE.LOD) for (c = 0; c < a.LODs.length; c++) b.LODs[c] = {
            visibleAtDistance: a.LODs[c].visibleAtDistance,
            object3D: b.children[c]
        };
        return b
    }
};
if (THREE.WebGLRenderer) THREE.ShaderUtils = {
    lib: {
        fresnel: {
            uniforms: {
                mRefractionRatio: {
                    type: "f",
                    value: 1.02
                },
                mFresnelBias: {
                    type: "f",
                    value: 0.1
                },
                mFresnelPower: {
                    type: "f",
                    value: 2
                },
                mFresnelScale: {
                    type: "f",
                    value: 1
                },
                tCube: {
                    type: "t",
                    value: 1,
                    texture: null
                }
            },
            fragmentShader: "uniform samplerCube tCube;\nvarying vec3 vReflect;\nvarying vec3 vRefract[3];\nvarying float vReflectionFactor;\nvoid main() {\nvec4 reflectedColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );\nvec4 refractedColor = vec4( 1.0, 1.0, 1.0, 1.0 );\nrefractedColor.r = textureCube( tCube, vec3( -vRefract[0].x, vRefract[0].yz ) ).r;\nrefractedColor.g = textureCube( tCube, vec3( -vRefract[1].x, vRefract[1].yz ) ).g;\nrefractedColor.b = textureCube( tCube, vec3( -vRefract[2].x, vRefract[2].yz ) ).b;\nrefractedColor.a = 1.0;\ngl_FragColor = mix( refractedColor, reflectedColor, clamp( vReflectionFactor, 0.0, 1.0 ) );\n}",
            vertexShader: "uniform float mRefractionRatio;\nuniform float mFresnelBias;\nuniform float mFresnelScale;\nuniform float mFresnelPower;\nvarying vec3 vReflect;\nvarying vec3 vRefract[3];\nvarying float vReflectionFactor;\nvoid main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\nvec3 nWorld = normalize ( mat3( objectMatrix[0].xyz, objectMatrix[1].xyz, objectMatrix[2].xyz ) * normal );\nvec3 I = mPosition.xyz - cameraPosition;\nvReflect = reflect( I, nWorld );\nvRefract[0] = refract( normalize( I ), nWorld, mRefractionRatio );\nvRefract[1] = refract( normalize( I ), nWorld, mRefractionRatio * 0.99 );\nvRefract[2] = refract( normalize( I ), nWorld, mRefractionRatio * 0.98 );\nvReflectionFactor = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( I ), nWorld ), mFresnelPower );\ngl_Position = projectionMatrix * mvPosition;\n}"
        },
        normal: {
            uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, THREE.UniformsLib.lights, THREE.UniformsLib.shadowmap,
            {
                enableAO: {
                    type: "i",
                    value: 0
                },
                enableDiffuse: {
                    type: "i",
                    value: 0
                },
                enableSpecular: {
                    type: "i",
                    value: 0
                },
                enableReflection: {
                    type: "i",
                    value: 0
                },
                tDiffuse: {
                    type: "t",
                    value: 0,
                    texture: null
                },
                tCube: {
                    type: "t",
                    value: 1,
                    texture: null
                },
                tNormal: {
                    type: "t",
                    value: 2,
                    texture: null
                },
                tSpecular: {
                    type: "t",
                    value: 3,
                    texture: null
                },
                tAO: {
                    type: "t",
                    value: 4,
                    texture: null
                },
                tDisplacement: {
                    type: "t",
                    value: 5,
                    texture: null
                },
                uNormalScale: {
                    type: "f",
                    value: 1
                },
                uDisplacementBias: {
                    type: "f",
                    value: 0
                },
                uDisplacementScale: {
                    type: "f",
                    value: 1
                },
                uDiffuseColor: {
                    type: "c",
                    value: new THREE.Color(15658734)
                },
                uSpecularColor: {
                    type: "c",
                    value: new THREE.Color(1118481)
                },
                uAmbientColor: {
                    type: "c",
                    value: new THREE.Color(328965)
                },
                uShininess: {
                    type: "f",
                    value: 30
                },
                uOpacity: {
                    type: "f",
                    value: 1
                },
                uReflectivity: {
                    type: "f",
                    value: 0.5
                },
                uOffset: {
                    type: "v2",
                    value: new THREE.Vector2(0, 0)
                },
                uRepeat: {
                    type: "v2",
                    value: new THREE.Vector2(1, 1)
                },
                wrapRGB: {
                    type: "v3",
                    value: new THREE.Vector3(1, 1, 1)
                }
            }]),
            fragmentShader: ["uniform vec3 uAmbientColor;\nuniform vec3 uDiffuseColor;\nuniform vec3 uSpecularColor;\nuniform float uShininess;\nuniform float uOpacity;\nuniform bool enableDiffuse;\nuniform bool enableSpecular;\nuniform bool enableAO;\nuniform bool enableReflection;\nuniform sampler2D tDiffuse;\nuniform sampler2D tNormal;\nuniform sampler2D tSpecular;\nuniform sampler2D tAO;\nuniform samplerCube tCube;\nuniform float uNormalScale;\nuniform float uReflectivity;\nvarying vec3 vTangent;\nvarying vec3 vBinormal;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nuniform vec3 ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\nuniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\nuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\nvarying vec4 vPointLight[ MAX_POINT_LIGHTS ];\n#endif\n#ifdef WRAP_AROUND\nuniform vec3 wrapRGB;\n#endif\nvarying vec3 vViewPosition;", THREE.ShaderChunk.shadowmap_pars_fragment, THREE.ShaderChunk.fog_pars_fragment, "void main() {\ngl_FragColor = vec4( vec3( 1.0 ), uOpacity );\nvec3 specularTex = vec3( 1.0 );\nvec3 normalTex = texture2D( tNormal, vUv ).xyz * 2.0 - 1.0;\nnormalTex.xy *= uNormalScale;\nnormalTex = normalize( normalTex );\nif( enableDiffuse ) {\n#ifdef GAMMA_INPUT\nvec4 texelColor = texture2D( tDiffuse, vUv );\ntexelColor.xyz *= texelColor.xyz;\ngl_FragColor = gl_FragColor * texelColor;\n#else\ngl_FragColor = gl_FragColor * texture2D( tDiffuse, vUv );\n#endif\n}\nif( enableAO ) {\n#ifdef GAMMA_INPUT\nvec4 aoColor = texture2D( tAO, vUv );\naoColor.xyz *= aoColor.xyz;\ngl_FragColor.xyz = gl_FragColor.xyz * aoColor.xyz;\n#else\ngl_FragColor.xyz = gl_FragColor.xyz * texture2D( tAO, vUv ).xyz;\n#endif\n}\nif( enableSpecular )\nspecularTex = texture2D( tSpecular, vUv ).xyz;\nmat3 tsb = mat3( normalize( vTangent ), normalize( vBinormal ), normalize( vNormal ) );\nvec3 finalNormal = tsb * normalTex;\nvec3 normal = normalize( finalNormal );\nvec3 viewPosition = normalize( vViewPosition );\n#if MAX_POINT_LIGHTS > 0\nvec3 pointDiffuse = vec3( 0.0 );\nvec3 pointSpecular = vec3( 0.0 );\nfor ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\nvec3 pointVector = normalize( vPointLight[ i ].xyz );\nfloat pointDistance = vPointLight[ i ].w;\n#ifdef WRAP_AROUND\nfloat pointDiffuseWeightFull = max( dot( normal, pointVector ), 0.0 );\nfloat pointDiffuseWeightHalf = max( 0.5 * dot( normal, pointVector ) + 0.5, 0.0 );\nvec3 pointDiffuseWeight = mix( vec3 ( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), wrapRGB );\n#else\nfloat pointDiffuseWeight = max( dot( normal, pointVector ), 0.0 );\n#endif\npointDiffuse += pointDistance * pointLightColor[ i ] * uDiffuseColor * pointDiffuseWeight;\nvec3 pointHalfVector = normalize( pointVector + viewPosition );\nfloat pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );\nfloat pointSpecularWeight = specularTex.r * max( pow( pointDotNormalHalf, uShininess ), 0.0 );\npointSpecular += pointDistance * pointLightColor[ i ] * uSpecularColor * pointSpecularWeight * pointDiffuseWeight;\n}\n#endif\n#if MAX_DIR_LIGHTS > 0\nvec3 dirDiffuse = vec3( 0.0 );\nvec3 dirSpecular = vec3( 0.0 );\nfor( int i = 0; i < MAX_DIR_LIGHTS; i++ ) {\nvec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\nvec3 dirVector = normalize( lDirection.xyz );\n#ifdef WRAP_AROUND\nfloat directionalLightWeightingFull = max( dot( normal, dirVector ), 0.0 );\nfloat directionalLightWeightingHalf = max( 0.5 * dot( normal, dirVector ) + 0.5, 0.0 );\nvec3 dirDiffuseWeight = mix( vec3( directionalLightWeightingFull ), vec3( directionalLightWeightingHalf ), wrapRGB );\n#else\nfloat dirDiffuseWeight = max( dot( normal, dirVector ), 0.0 );\n#endif\ndirDiffuse += directionalLightColor[ i ] * uDiffuseColor * dirDiffuseWeight;\nvec3 dirHalfVector = normalize( dirVector + viewPosition );\nfloat dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );\nfloat dirSpecularWeight = specularTex.r * max( pow( dirDotNormalHalf, uShininess ), 0.0 );\ndirSpecular += directionalLightColor[ i ] * uSpecularColor * dirSpecularWeight * dirDiffuseWeight;\n}\n#endif\nvec3 totalDiffuse = vec3( 0.0 );\nvec3 totalSpecular = vec3( 0.0 );\n#if MAX_DIR_LIGHTS > 0\ntotalDiffuse += dirDiffuse;\ntotalSpecular += dirSpecular;\n#endif\n#if MAX_POINT_LIGHTS > 0\ntotalDiffuse += pointDiffuse;\ntotalSpecular += pointSpecular;\n#endif\ngl_FragColor.xyz = gl_FragColor.xyz * ( totalDiffuse + ambientLightColor * uAmbientColor) + totalSpecular;\nif ( enableReflection ) {\nvec3 wPos = cameraPosition - vViewPosition;\nvec3 vReflect = reflect( normalize( wPos ), normal );\nvec4 cubeColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );\n#ifdef GAMMA_INPUT\ncubeColor.xyz *= cubeColor.xyz;\n#endif\ngl_FragColor.xyz = mix( gl_FragColor.xyz, cubeColor.xyz, specularTex.r * uReflectivity );\n}", THREE.ShaderChunk.shadowmap_fragment, THREE.ShaderChunk.linear_to_gamma_fragment, THREE.ShaderChunk.fog_fragment, "}"].join("\n"),
            vertexShader: ["attribute vec4 tangent;\nuniform vec2 uOffset;\nuniform vec2 uRepeat;\n#ifdef VERTEX_TEXTURES\nuniform sampler2D tDisplacement;\nuniform float uDisplacementScale;\nuniform float uDisplacementBias;\n#endif\nvarying vec3 vTangent;\nvarying vec3 vBinormal;\nvarying vec3 vNormal;\nvarying vec2 vUv;\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\nuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\nvarying vec4 vPointLight[ MAX_POINT_LIGHTS ];\n#endif\nvarying vec3 vViewPosition;", THREE.ShaderChunk.shadowmap_pars_vertex, "void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\nvViewPosition = -mvPosition.xyz;\nvNormal = normalMatrix * normal;\nvTangent = normalMatrix * tangent.xyz;\nvBinormal = cross( vNormal, vTangent ) * tangent.w;\nvUv = uv * uRepeat + uOffset;\n#if MAX_POINT_LIGHTS > 0\nfor( int i = 0; i < MAX_POINT_LIGHTS; i++ ) {\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz - mvPosition.xyz;\nfloat lDistance = 1.0;\nif ( pointLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\nlVector = normalize( lVector );\nvPointLight[ i ] = vec4( lVector, lDistance );\n}\n#endif\n#ifdef VERTEX_TEXTURES\nvec3 dv = texture2D( tDisplacement, uv ).xyz;\nfloat df = uDisplacementScale * dv.x + uDisplacementBias;\nvec4 displacedPosition = vec4( normalize( vNormal.xyz ) * df, 0.0 ) + mvPosition;\ngl_Position = projectionMatrix * displacedPosition;\n#else\ngl_Position = projectionMatrix * mvPosition;\n#endif", THREE.ShaderChunk.shadowmap_vertex, "}"].join("\n")
        },
        cube: {
            uniforms: {
                tCube: {
                    type: "t",
                    value: 1,
                    texture: null
                },
                tFlip: {
                    type: "f",
                    value: -1
                }
            },
            vertexShader: "varying vec3 vViewPosition;\nvoid main() {\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\nvViewPosition = cameraPosition - mPosition.xyz;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
            fragmentShader: "uniform samplerCube tCube;\nuniform float tFlip;\nvarying vec3 vViewPosition;\nvoid main() {\nvec3 wPos = cameraPosition - vViewPosition;\ngl_FragColor = textureCube( tCube, vec3( tFlip * wPos.x, wPos.yz ) );\n}"
        }
    }
};
THREE.BufferGeometry = function() {
    this.id = THREE.GeometryCount++;
    this.vertexColorArray = this.vertexUvArray = this.vertexNormalArray = this.vertexPositionArray = this.vertexIndexArray = this.vertexColorBuffer = this.vertexUvBuffer = this.vertexNormalBuffer = this.vertexPositionBuffer = this.vertexIndexBuffer = null;
    this.dynamic = !1;
    this.boundingSphere = this.boundingBox = null;
    this.morphTargets = []
};
THREE.BufferGeometry.prototype = {
    constructor: THREE.BufferGeometry,
    computeBoundingBox: function() {},
    computeBoundingSphere: function() {}
};
THREE.Curve = function() {};
THREE.Curve.prototype.getPoint = function() {
    console.log("Warning, getPoint() not implemented!");
    return null
};
THREE.Curve.prototype.getPointAt = function(a) {
    return this.getPoint(this.getUtoTmapping(a))
};
THREE.Curve.prototype.getPoints = function(a) {
    a || (a = 5);
    var b, c = [];
    for (b = 0; b <= a; b++) c.push(this.getPoint(b / a));
    return c
};
THREE.Curve.prototype.getSpacedPoints = function(a) {
    a || (a = 5);
    var b, c = [];
    for (b = 0; b <= a; b++) c.push(this.getPointAt(b / a));
    return c
};
THREE.Curve.prototype.getLength = function() {
    var a = this.getLengths();
    return a[a.length - 1]
};
THREE.Curve.prototype.getLengths = function(a) {
    a || (a = 200);
    if (this.cacheArcLengths && this.cacheArcLengths.length == a + 1) return this.cacheArcLengths;
    var b = [],
        c, d = this.getPoint(0),
        f, g = 0;
    b.push(0);
    for (f = 1; f <= a; f++) c = this.getPoint(f / a), g += c.distanceTo(d), b.push(g), d = c;
    return this.cacheArcLengths = b
};
THREE.Curve.prototype.getUtoTmapping = function(a, b) {
    var c = this.getLengths(),
        d = 0,
        f = c.length,
        g;
    g = b ? b : a * c[f - 1];
    for (var e = 0, h = f - 1, i; e <= h;) if (d = Math.floor(e + (h - e) / 2), i = c[d] - g, 0 > i) e = d + 1;
    else if (0 < i) h = d - 1;
    else {
        h = d;
        break
    }
    d = h;
    if (c[d] == g) return d / (f - 1);
    e = c[d];
    return c = (d + (g - e) / (c[d + 1] - e)) / (f - 1)
};
THREE.Curve.prototype.getNormalVector = function(a) {
    a = this.getTangent(a);
    return new THREE.Vector2(-a.y, a.x)
};
THREE.Curve.prototype.getTangent = function(a) {
    var b = a - 1.0E-4,
        a = a + 1.0E-4;
    0 > b && (b = 0);
    1 < a && (a = 1);
    b = this.getPoint(b);
    a = this.getPoint(a);
    return b.clone().subSelf(a).normalize()
};
THREE.Curve.prototype.getTangentAt = function(a) {
    return this.getTangent(this.getUtoTmapping(a))
};
THREE.LineCurve = function(a, b) {
    a instanceof THREE.Vector2 ? (this.v1 = a, this.v2 = b) : THREE.LineCurve.oldConstructor.apply(this, arguments)
};
THREE.LineCurve.oldConstructor = function(a, b, c, d) {
    this.constructor(new THREE.Vector2(a, b), new THREE.Vector2(c, d))
};
THREE.LineCurve.prototype = new THREE.Curve;
THREE.LineCurve.prototype.constructor = THREE.LineCurve;
THREE.LineCurve.prototype.getPoint = function(a) {
    var b = new THREE.Vector2;
    b.sub(this.v2, this.v1);
    b.multiplyScalar(a).addSelf(this.v1);
    return b
};
THREE.LineCurve.prototype.getPointAt = function(a) {
    return this.getPoint(a)
};
THREE.LineCurve.prototype.getTangent = function() {
    var a = new THREE.Vector2;
    a.sub(this.v2, this.v1);
    a.normalize();
    return a
};
THREE.QuadraticBezierCurve = function(a, b, c) {
    if (!(b instanceof THREE.Vector2)) var d = Array.prototype.slice.call(arguments),
        a = new THREE.Vector2(d[0], d[1]),
        b = new THREE.Vector2(d[2], d[3]),
        c = new THREE.Vector2(d[4], d[5]);
    this.v0 = a;
    this.v1 = b;
    this.v2 = c
};
THREE.QuadraticBezierCurve.prototype = new THREE.Curve;
THREE.QuadraticBezierCurve.prototype.constructor = THREE.QuadraticBezierCurve;
THREE.QuadraticBezierCurve.prototype.getPoint = function(a) {
    var b;
    b = THREE.Shape.Utils.b2(a, this.v0.x, this.v1.x, this.v2.x);
    a = THREE.Shape.Utils.b2(a, this.v0.y, this.v1.y, this.v2.y);
    return new THREE.Vector2(b, a)
};
THREE.QuadraticBezierCurve.prototype.getTangent = function(a) {
    var b;
    b = THREE.Curve.Utils.tangentQuadraticBezier(a, this.v0.x, this.v1.x, this.v2.x);
    a = THREE.Curve.Utils.tangentQuadraticBezier(a, this.v0.y, this.v1.y, this.v2.y);
    b = new THREE.Vector2(b, a);
    b.normalize();
    return b
};
THREE.CubicBezierCurve = function(a, b, c, d) {
    if (!(b instanceof THREE.Vector2)) var f = Array.prototype.slice.call(arguments),
        a = new THREE.Vector2(f[0], f[1]),
        b = new THREE.Vector2(f[2], f[3]),
        c = new THREE.Vector2(f[4], f[5]),
        d = new THREE.Vector2(f[6], f[7]);
    this.v0 = a;
    this.v1 = b;
    this.v2 = c;
    this.v3 = d
};
THREE.CubicBezierCurve.prototype = new THREE.Curve;
THREE.CubicBezierCurve.prototype.constructor = THREE.CubicBezierCurve;
THREE.CubicBezierCurve.prototype.getPoint = function(a) {
    var b;
    b = THREE.Shape.Utils.b3(a, this.v0.x, this.v1.x, this.v2.x, this.v3.x);
    a = THREE.Shape.Utils.b3(a, this.v0.y, this.v1.y, this.v2.y, this.v3.y);
    return new THREE.Vector2(b, a)
};
THREE.CubicBezierCurve.prototype.getTangent = function(a) {
    var b;
    b = THREE.Curve.Utils.tangentCubicBezier(a, this.v0.x, this.v1.x, this.v2.x, this.v3.x);
    a = THREE.Curve.Utils.tangentCubicBezier(a, this.v0.y, this.v1.y, this.v2.y, this.v3.y);
    b = new THREE.Vector2(b, a);
    b.normalize();
    return b
};
THREE.SplineCurve = function(a) {
    this.points = void 0 == a ? [] : a
};
THREE.SplineCurve.prototype = new THREE.Curve;
THREE.SplineCurve.prototype.constructor = THREE.SplineCurve;
THREE.SplineCurve.prototype.getPoint = function(a) {
    var b = new THREE.Vector2,
        c = [],
        d = this.points,
        f;
    f = (d.length - 1) * a;
    a = Math.floor(f);
    f -= a;
    c[0] = 0 == a ? a : a - 1;
    c[1] = a;
    c[2] = a > d.length - 2 ? a : a + 1;
    c[3] = a > d.length - 3 ? a : a + 2;
    b.x = THREE.Curve.Utils.interpolate(d[c[0]].x, d[c[1]].x, d[c[2]].x, d[c[3]].x, f);
    b.y = THREE.Curve.Utils.interpolate(d[c[0]].y, d[c[1]].y, d[c[2]].y, d[c[3]].y, f);
    return b
};
THREE.ArcCurve = function(a, b, c, d, f, g) {
    this.aX = a;
    this.aY = b;
    this.aRadius = c;
    this.aStartAngle = d;
    this.aEndAngle = f;
    this.aClockwise = g
};
THREE.ArcCurve.prototype = new THREE.Curve;
THREE.ArcCurve.prototype.constructor = THREE.ArcCurve;
THREE.ArcCurve.prototype.getPoint = function(a) {
    var b = this.aEndAngle - this.aStartAngle;
    this.aClockwise || (a = 1 - a);
    b = this.aStartAngle + a * b;
    a = this.aX + this.aRadius * Math.cos(b);
    b = this.aY + this.aRadius * Math.sin(b);
    return new THREE.Vector2(a, b)
};
THREE.Curve.Utils = {
    tangentQuadraticBezier: function(a, b, c, d) {
        return 2 * (1 - a) * (c - b) + 2 * a * (d - c)
    },
    tangentCubicBezier: function(a, b, c, d, f) {
        return -3 * b * (1 - a) * (1 - a) + 3 * c * (1 - a) * (1 - a) - 6 * a * c * (1 - a) + 6 * a * d * (1 - a) - 3 * a * a * d + 3 * a * a * f
    },
    tangentSpline: function(a) {
        return 6 * a * a - 6 * a + (3 * a * a - 4 * a + 1) + (-6 * a * a + 6 * a) + (3 * a * a - 2 * a)
    },
    interpolate: function(a, b, c, d, f) {
        var a = 0.5 * (c - a),
            d = 0.5 * (d - b),
            g = f * f;
        return (2 * b - 2 * c + a + d) * f * g + (-3 * b + 3 * c - 2 * a - d) * g + a * f + b
    }
};
THREE.Curve.create = function(a, b) {
    a.prototype = new THREE.Curve;
    a.prototype.constructor = a;
    a.prototype.getPoint = b;
    return a
};
THREE.LineCurve3 = THREE.Curve.create(function(a, b) {
    this.v1 = a;
    this.v2 = b
}, function(a) {
    var b = new THREE.Vector3;
    b.sub(this.v2, this.v1);
    b.multiplyScalar(a);
    b.addSelf(this.v1);
    return b
});
THREE.QuadraticBezierCurve3 = THREE.Curve.create(function(a, b, c) {
    this.v0 = a;
    this.v1 = b;
    this.v2 = c
}, function(a) {
    var b, c;
    b = THREE.Shape.Utils.b2(a, this.v0.x, this.v1.x, this.v2.x);
    c = THREE.Shape.Utils.b2(a, this.v0.y, this.v1.y, this.v2.y);
    a = THREE.Shape.Utils.b2(a, this.v0.z, this.v1.z, this.v2.z);
    return new THREE.Vector3(b, c, a)
});
THREE.CubicBezierCurve3 = THREE.Curve.create(function(a, b, c, d) {
    this.v0 = a;
    this.v1 = b;
    this.v2 = c;
    this.v3 = d
}, function(a) {
    var b, c;
    b = THREE.Shape.Utils.b3(a, this.v0.x, this.v1.x, this.v2.x, this.v3.x);
    c = THREE.Shape.Utils.b3(a, this.v0.y, this.v1.y, this.v2.y, this.v3.y);
    a = THREE.Shape.Utils.b3(a, this.v0.z, this.v1.z, this.v2.z, this.v3.z);
    return new THREE.Vector3(b, c, a)
});
THREE.SplineCurve3 = THREE.Curve.create(function(a) {
    this.points = void 0 == a ? [] : a
}, function(a) {
    var b = new THREE.Vector3,
        c = [],
        d = this.points,
        f;
    f = (d.length - 1) * a;
    a = Math.floor(f);
    f -= a;
    c[0] = 0 == a ? a : a - 1;
    c[1] = a;
    c[2] = a > d.length - 2 ? a : a + 1;
    c[3] = a > d.length - 3 ? a : a + 2;
    b.x = THREE.Curve.Utils.interpolate(d[c[0]].x, d[c[1]].x, d[c[2]].x, d[c[3]].x, f);
    b.y = THREE.Curve.Utils.interpolate(d[c[0]].y, d[c[1]].y, d[c[2]].y, d[c[3]].y, f);
    b.z = THREE.Curve.Utils.interpolate(d[c[0]].z, d[c[1]].z, d[c[2]].z, d[c[3]].z, f);
    return b
});
THREE.CurvePath = function() {
    this.curves = [];
    this.bends = [];
    this.autoClose = !1
};
THREE.CurvePath.prototype = new THREE.Curve;
THREE.CurvePath.prototype.constructor = THREE.CurvePath;
THREE.CurvePath.prototype.add = function(a) {
    this.curves.push(a)
};
THREE.CurvePath.prototype.checkConnection = function() {};
THREE.CurvePath.prototype.closePath = function() {
    var a = this.curves[0].getPoint(0),
        b = this.curves[this.curves.length - 1].getPoint(1);
    a.equals(b) || this.curves.push(new THREE.LineCurve(b, a))
};
THREE.CurvePath.prototype.getPoint = function(a) {
    for (var b = a * this.getLength(), c = this.getCurveLengths(), a = 0; a < c.length;) {
        if (c[a] >= b) return b = c[a] - b, a = this.curves[a], b = 1 - b / a.getLength(), a.getPointAt(b);
        a++
    }
    return null
};
THREE.CurvePath.prototype.getLength = function() {
    var a = this.getCurveLengths();
    return a[a.length - 1]
};
THREE.CurvePath.prototype.getCurveLengths = function() {
    if (this.cacheLengths && this.cacheLengths.length == this.curves.length) return this.cacheLengths;
    var a = [],
        b = 0,
        c, d = this.curves.length;
    for (c = 0; c < d; c++) b += this.curves[c].getLength(), a.push(b);
    return this.cacheLengths = a
};
THREE.CurvePath.prototype.getBoundingBox = function() {
    var a = this.getPoints(),
        b, c, d, f;
    b = c = Number.NEGATIVE_INFINITY;
    d = f = Number.POSITIVE_INFINITY;
    var g, e, h, i;
    i = new THREE.Vector2;
    for (e = 0, h = a.length; e < h; e++) {
        g = a[e];
        if (g.x > b) b = g.x;
        else if (g.x < d) d = g.x;
        if (g.y > c) c = g.y;
        else if (g.y < c) f = g.y;
        i.addSelf(g.x, g.y)
    }
    return {
        minX: d,
        minY: f,
        maxX: b,
        maxY: c,
        centroid: i.divideScalar(h)
    }
};
THREE.CurvePath.prototype.createPointsGeometry = function(a) {
    return this.createGeometry(this.getPoints(a, !0))
};
THREE.CurvePath.prototype.createSpacedPointsGeometry = function(a) {
    return this.createGeometry(this.getSpacedPoints(a, !0))
};
THREE.CurvePath.prototype.createGeometry = function(a) {
    for (var b = new THREE.Geometry, c = 0; c < a.length; c++) b.vertices.push(new THREE.Vertex(new THREE.Vector3(a[c].x, a[c].y, 0)));
    return b
};
THREE.CurvePath.prototype.addWrapPath = function(a) {
    this.bends.push(a)
};
THREE.CurvePath.prototype.getTransformedPoints = function(a, b) {
    var c = this.getPoints(a),
        d, f;
    if (!b) b = this.bends;
    for (d = 0, f = b.length; d < f; d++) c = this.getWrapPoints(c, b[d]);
    return c
};
THREE.CurvePath.prototype.getTransformedSpacedPoints = function(a, b) {
    var c = this.getSpacedPoints(a),
        d, f;
    if (!b) b = this.bends;
    for (d = 0, f = b.length; d < f; d++) c = this.getWrapPoints(c, b[d]);
    return c
};
THREE.CurvePath.prototype.getWrapPoints = function(a, b) {
    var c = this.getBoundingBox(),
        d, f, g, e, h, i;
    for (d = 0, f = a.length; d < f; d++) g = a[d], e = g.x, h = g.y, i = e / c.maxX, i = b.getUtoTmapping(i, e), e = b.getPoint(i), h = b.getNormalVector(i).multiplyScalar(h), g.x = e.x + h.x, g.y = e.y + h.y;
    return a
};
THREE.Gyroscope = function() {
    THREE.Object3D.call(this)
};
THREE.Gyroscope.prototype = new THREE.Object3D;
THREE.Gyroscope.prototype.constructor = THREE.Gyroscope;
THREE.Gyroscope.prototype.updateMatrixWorld = function(a) {
    this.matrixAutoUpdate && this.updateMatrix();
    if (this.matrixWorldNeedsUpdate || a) this.parent ? (this.matrixWorld.multiply(this.parent.matrixWorld, this.matrix), this.matrixWorld.decompose(this.translationWorld, this.rotationWorld, this.scaleWorld), this.matrix.decompose(this.translationObject, this.rotationObject, this.scaleObject), this.matrixWorld.compose(this.translationWorld, this.rotationObject, this.scaleWorld)) : this.matrixWorld.copy(this.matrix), this.matrixWorldNeedsUpdate = !1, a = !0;
    for (var b = 0, c = this.children.length; b < c; b++) this.children[b].updateMatrixWorld(a)
};
THREE.Gyroscope.prototype.translationWorld = new THREE.Vector3;
THREE.Gyroscope.prototype.translationObject = new THREE.Vector3;
THREE.Gyroscope.prototype.rotationWorld = new THREE.Quaternion;
THREE.Gyroscope.prototype.rotationObject = new THREE.Quaternion;
THREE.Gyroscope.prototype.scaleWorld = new THREE.Vector3;
THREE.Gyroscope.prototype.scaleObject = new THREE.Vector3;
THREE.Path = function(a) {
    THREE.CurvePath.call(this);
    this.actions = [];
    a && this.fromPoints(a)
};
THREE.Path.prototype = new THREE.CurvePath;
THREE.Path.prototype.constructor = THREE.Path;
THREE.PathActions = {
    MOVE_TO: "moveTo",
    LINE_TO: "lineTo",
    QUADRATIC_CURVE_TO: "quadraticCurveTo",
    BEZIER_CURVE_TO: "bezierCurveTo",
    CSPLINE_THRU: "splineThru",
    ARC: "arc"
};
THREE.Path.prototype.fromPoints = function(a) {
    this.moveTo(a[0].x, a[0].y);
    for (var b = 1, c = a.length; b < c; b++) this.lineTo(a[b].x, a[b].y)
};
THREE.Path.prototype.moveTo = function(a, b) {
    var c = Array.prototype.slice.call(arguments);
    this.actions.push({
        action: THREE.PathActions.MOVE_TO,
        args: c
    })
};
THREE.Path.prototype.lineTo = function(a, b) {
    var c = Array.prototype.slice.call(arguments),
        d = this.actions[this.actions.length - 1].args;
    this.curves.push(new THREE.LineCurve(new THREE.Vector2(d[d.length - 2], d[d.length - 1]), new THREE.Vector2(a, b)));
    this.actions.push({
        action: THREE.PathActions.LINE_TO,
        args: c
    })
};
THREE.Path.prototype.quadraticCurveTo = function(a, b, c, d) {
    var f = Array.prototype.slice.call(arguments),
        g = this.actions[this.actions.length - 1].args;
    this.curves.push(new THREE.QuadraticBezierCurve(new THREE.Vector2(g[g.length - 2], g[g.length - 1]), new THREE.Vector2(a, b), new THREE.Vector2(c, d)));
    this.actions.push({
        action: THREE.PathActions.QUADRATIC_CURVE_TO,
        args: f
    })
};
THREE.Path.prototype.bezierCurveTo = function(a, b, c, d, f, g) {
    var e = Array.prototype.slice.call(arguments),
        h = this.actions[this.actions.length - 1].args;
    this.curves.push(new THREE.CubicBezierCurve(new THREE.Vector2(h[h.length - 2], h[h.length - 1]), new THREE.Vector2(a, b), new THREE.Vector2(c, d), new THREE.Vector2(f, g)));
    this.actions.push({
        action: THREE.PathActions.BEZIER_CURVE_TO,
        args: e
    })
};
THREE.Path.prototype.splineThru = function(a) {
    var b = Array.prototype.slice.call(arguments),
        c = this.actions[this.actions.length - 1].args,
        c = [new THREE.Vector2(c[c.length - 2], c[c.length - 1])];
    Array.prototype.push.apply(c, a);
    this.curves.push(new THREE.SplineCurve(c));
    this.actions.push({
        action: THREE.PathActions.CSPLINE_THRU,
        args: b
    })
};
THREE.Path.prototype.arc = function(a, b, c, d, f, g) {
    var e = Array.prototype.slice.call(arguments);
    this.curves.push(new THREE.ArcCurve(a, b, c, d, f, g));
    this.actions.push({
        action: THREE.PathActions.ARC,
        args: e
    })
};
THREE.Path.prototype.getSpacedPoints = function(a) {
    a || (a = 40);
    for (var b = [], c = 0; c < a; c++) b.push(this.getPoint(c / a));
    return b
};
THREE.Path.prototype.getPoints = function(a, b) {
    var a = a || 12,
        c = [],
        d, f, g, e, h, i, k, j, m, p, n, l, o;
    for (d = 0, f = this.actions.length; d < f; d++) switch (g = this.actions[d], e = g.action, g = g.args, e) {
    case THREE.PathActions.LINE_TO:
        c.push(new THREE.Vector2(g[0], g[1]));
        break;
    case THREE.PathActions.QUADRATIC_CURVE_TO:
        h = g[2];
        i = g[3];
        m = g[0];
        p = g[1];
        0 < c.length ? (e = c[c.length - 1], n = e.x, l = e.y) : (e = this.actions[d - 1].args, n = e[e.length - 2], l = e[e.length - 1]);
        for (e = 1; e <= a; e++) o = e / a, g = THREE.Shape.Utils.b2(o, n, m, h), o = THREE.Shape.Utils.b2(o, l, p, i), c.push(new THREE.Vector2(g, o));
        break;
    case THREE.PathActions.BEZIER_CURVE_TO:
        h = g[4];
        i = g[5];
        m = g[0];
        p = g[1];
        k = g[2];
        j = g[3];
        0 < c.length ? (e = c[c.length - 1], n = e.x, l = e.y) : (e = this.actions[d - 1].args, n = e[e.length - 2], l = e[e.length - 1]);
        for (e = 1; e <= a; e++) o = e / a, g = THREE.Shape.Utils.b3(o, n, m, k, h), o = THREE.Shape.Utils.b3(o, l, p, j, i), c.push(new THREE.Vector2(g, o));
        break;
    case THREE.PathActions.CSPLINE_THRU:
        e = this.actions[d - 1].args;
        e = [new THREE.Vector2(e[e.length - 2], e[e.length - 1])];
        o = a * g[0].length;
        e = e.concat(g[0]);
        g = new THREE.SplineCurve(e);
        for (e = 1; e <= o; e++) c.push(g.getPointAt(e / o));
        break;
    case THREE.PathActions.ARC:
        e = this.actions[d - 1].args;
        h = g[0];
        i = g[1];
        k = g[2];
        m = g[3];
        o = g[4];
        p = !! g[5];
        j = e[e.length - 2];
        n = e[e.length - 1];
        0 == e.length && (j = n = 0);
        l = o - m;
        var q = 2 * a;
        for (e = 1; e <= q; e++) o = e / q, p || (o = 1 - o), o = m + o * l, g = j + h + k * Math.cos(o), o = n + i + k * Math.sin(o), c.push(new THREE.Vector2(g, o))
    }
    b && c.push(c[0]);
    return c
};
THREE.Path.prototype.transform = function(a, b) {
    this.getBoundingBox();
    return this.getWrapPoints(this.getPoints(b), a)
};
THREE.Path.prototype.nltransform = function(a, b, c, d, f, g) {
    var e = this.getPoints(),
        h, i, k, j, m;
    for (h = 0, i = e.length; h < i; h++) k = e[h], j = k.x, m = k.y, k.x = a * j + b * m + c, k.y = d * m + f * j + g;
    return e
};
THREE.Path.prototype.debug = function(a) {
    var b = this.getBoundingBox();
    a || (a = document.createElement("canvas"), a.setAttribute("width", b.maxX + 100), a.setAttribute("height", b.maxY + 100), document.body.appendChild(a));
    b = a.getContext("2d");
    b.fillStyle = "white";
    b.fillRect(0, 0, a.width, a.height);
    b.strokeStyle = "black";
    b.beginPath();
    var c, d, f;
    for (a = 0, c = this.actions.length; a < c; a++) d = this.actions[a], f = d.args, d = d.action, d != THREE.PathActions.CSPLINE_THRU && b[d].apply(b, f);
    b.stroke();
    b.closePath();
    b.strokeStyle = "red";
    d = this.getPoints();
    for (a = 0, c = d.length; a < c; a++) f = d[a], b.beginPath(), b.arc(f.x, f.y, 1.5, 0, 2 * Math.PI, !1), b.stroke(), b.closePath()
};
THREE.Path.prototype.toShapes = function() {
    var a, b, c, d, f = [],
        g = new THREE.Path;
    for (a = 0, b = this.actions.length; a < b; a++) c = this.actions[a], d = c.args, c = c.action, c == THREE.PathActions.MOVE_TO && 0 != g.actions.length && (f.push(g), g = new THREE.Path), g[c].apply(g, d);
    0 != g.actions.length && f.push(g);
    if (0 == f.length) return [];
    var e;
    d = [];
    a = !THREE.Shape.Utils.isClockWise(f[0].getPoints());
    if (1 == f.length) return g = f[0], e = new THREE.Shape, e.actions = g.actions, e.curves = g.curves, d.push(e), d;
    if (a) {
        e = new THREE.Shape;
        for (a = 0, b = f.length; a < b; a++) g = f[a], THREE.Shape.Utils.isClockWise(g.getPoints()) ? (e.actions = g.actions, e.curves = g.curves, d.push(e), e = new THREE.Shape) : e.holes.push(g)
    } else {
        for (a = 0, b = f.length; a < b; a++) g = f[a], THREE.Shape.Utils.isClockWise(g.getPoints()) ? (e && d.push(e), e = new THREE.Shape, e.actions = g.actions, e.curves = g.curves) : e.holes.push(g);
        d.push(e)
    }
    return d
};
THREE.Shape = function() {
    THREE.Path.apply(this, arguments);
    this.holes = []
};
THREE.Shape.prototype = new THREE.Path;
THREE.Shape.prototype.constructor = THREE.Path;
THREE.Shape.prototype.extrude = function(a) {
    return new THREE.ExtrudeGeometry(this, a)
};
THREE.Shape.prototype.getPointsHoles = function(a) {
    var b, c = this.holes.length,
        d = [];
    for (b = 0; b < c; b++) d[b] = this.holes[b].getTransformedPoints(a, this.bends);
    return d
};
THREE.Shape.prototype.getSpacedPointsHoles = function(a) {
    var b, c = this.holes.length,
        d = [];
    for (b = 0; b < c; b++) d[b] = this.holes[b].getTransformedSpacedPoints(a, this.bends);
    return d
};
THREE.Shape.prototype.extractAllPoints = function(a) {
    return {
        shape: this.getTransformedPoints(a),
        holes: this.getPointsHoles(a)
    }
};
THREE.Shape.prototype.extractAllSpacedPoints = function(a) {
    return {
        shape: this.getTransformedSpacedPoints(a),
        holes: this.getSpacedPointsHoles(a)
    }
};
THREE.Shape.Utils = {
    removeHoles: function(a, b) {
        var c = a.concat(),
            d = c.concat(),
            f, g, e, h, i, k, j, m, p, n, l = [];
        for (i = 0; i < b.length; i++) {
            k = b[i];
            Array.prototype.push.apply(d, k);
            g = Number.POSITIVE_INFINITY;
            for (f = 0; f < k.length; f++) {
                p = k[f];
                n = [];
                for (m = 0; m < c.length; m++) j = c[m], j = p.distanceToSquared(j), n.push(j), j < g && (g = j, e = f, h = m)
            }
            f = 0 <= h - 1 ? h - 1 : c.length - 1;
            g = 0 <= e - 1 ? e - 1 : k.length - 1;
            var o = [k[e], c[h], c[f]];
            m = THREE.FontUtils.Triangulate.area(o);
            var q = [k[e], k[g], c[h]];
            p = THREE.FontUtils.Triangulate.area(q);
            n = h;
            j = e;
            h += 1;
            e += -1;
            0 > h && (h += c.length);
            h %= c.length;
            0 > e && (e += k.length);
            e %= k.length;
            f = 0 <= h - 1 ? h - 1 : c.length - 1;
            g = 0 <= e - 1 ? e - 1 : k.length - 1;
            o = [k[e], c[h], c[f]];
            o = THREE.FontUtils.Triangulate.area(o);
            q = [k[e], k[g], c[h]];
            q = THREE.FontUtils.Triangulate.area(q);
            m + p > o + q && (h = n, e = j, 0 > h && (h += c.length), h %= c.length, 0 > e && (e += k.length), e %= k.length, f = 0 <= h - 1 ? h - 1 : c.length - 1, g = 0 <= e - 1 ? e - 1 : k.length - 1);
            m = c.slice(0, h);
            p = c.slice(h);
            n = k.slice(e);
            j = k.slice(0, e);
            g = [k[e], k[g], c[h]];
            l.push([k[e], c[h], c[f]]);
            l.push(g);
            c = m.concat(n).concat(j).concat(p)
        }
        return {
            shape: c,
            isolatedPts: l,
            allpoints: d
        }
    },
    triangulateShape: function(a, b) {
        var c = THREE.Shape.Utils.removeHoles(a, b),
            d = c.allpoints,
            f = c.isolatedPts,
            c = THREE.FontUtils.Triangulate(c.shape, !1),
            g, e, h, i, k = {};
        for (g = 0, e = d.length; g < e; g++) i = d[g].x + ":" + d[g].y, void 0 !== k[i] && console.log("Duplicate point", i), k[i] = g;
        for (g = 0, e = c.length; g < e; g++) {
            h = c[g];
            for (d = 0; 3 > d; d++) i = h[d].x + ":" + h[d].y, i = k[i], void 0 !== i && (h[d] = i)
        }
        for (g = 0, e = f.length; g < e; g++) {
            h = f[g];
            for (d = 0; 3 > d; d++) i = h[d].x + ":" + h[d].y, i = k[i], void 0 !== i && (h[d] = i)
        }
        return c.concat(f)
    },
    isClockWise: function(a) {
        return 0 > THREE.FontUtils.Triangulate.area(a)
    },
    b2p0: function(a, b) {
        var c = 1 - a;
        return c * c * b
    },
    b2p1: function(a, b) {
        return 2 * (1 - a) * a * b
    },
    b2p2: function(a, b) {
        return a * a * b
    },
    b2: function(a, b, c, d) {
        return this.b2p0(a, b) + this.b2p1(a, c) + this.b2p2(a, d)
    },
    b3p0: function(a, b) {
        var c = 1 - a;
        return c * c * c * b
    },
    b3p1: function(a, b) {
        var c = 1 - a;
        return 3 * c * c * a * b
    },
    b3p2: function(a, b) {
        return 3 * (1 - a) * a * a * b
    },
    b3p3: function(a, b) {
        return a * a * a * b
    },
    b3: function(a, b, c, d, f) {
        return this.b3p0(a, b) + this.b3p1(a, c) + this.b3p2(a, d) + this.b3p3(a, f)
    }
};
THREE.TextPath = function(a, b) {
    THREE.Path.call(this);
    this.parameters = b || {};
    this.set(a)
};
THREE.TextPath.prototype.set = function(a, b) {
    b = b || this.parameters;
    this.text = a;
    var c = void 0 !== b.curveSegments ? b.curveSegments : 4,
        d = void 0 !== b.font ? b.font : "helvetiker",
        f = void 0 !== b.weight ? b.weight : "normal",
        g = void 0 !== b.style ? b.style : "normal";
    THREE.FontUtils.size = void 0 !== b.size ? b.size : 100;
    THREE.FontUtils.divisions = c;
    THREE.FontUtils.face = d;
    THREE.FontUtils.weight = f;
    THREE.FontUtils.style = g
};
THREE.TextPath.prototype.toShapes = function() {
    for (var a = THREE.FontUtils.drawText(this.text).paths, b = [], c = 0, d = a.length; c < d; c++) Array.prototype.push.apply(b, a[c].toShapes());
    return b
};
THREE.AnimationHandler = function() {
    var a = [],
        b = {},
        c = {
            update: function(b) {
                for (var c = 0; c < a.length; c++) a[c].update(b)
            },
            addToUpdate: function(b) {
                -1 === a.indexOf(b) && a.push(b)
            },
            removeFromUpdate: function(b) {
                b = a.indexOf(b); - 1 !== b && a.splice(b, 1)
            },
            add: function(a) {
                void 0 !== b[a.name] && console.log("THREE.AnimationHandler.add: Warning! " + a.name + " already exists in library. Overwriting.");
                b[a.name] = a;
                if (!0 !== a.initialized) {
                    for (var c = 0; c < a.hierarchy.length; c++) {
                        for (var d = 0; d < a.hierarchy[c].keys.length; d++) {
                            if (0 > a.hierarchy[c].keys[d].time) a.hierarchy[c].keys[d].time = 0;
                            if (void 0 !== a.hierarchy[c].keys[d].rot && !(a.hierarchy[c].keys[d].rot instanceof THREE.Quaternion)) {
                                var h = a.hierarchy[c].keys[d].rot;
                                a.hierarchy[c].keys[d].rot = new THREE.Quaternion(h[0], h[1], h[2], h[3])
                            }
                        }
                        if (a.hierarchy[c].keys.length && void 0 !== a.hierarchy[c].keys[0].morphTargets) {
                            h = {};
                            for (d = 0; d < a.hierarchy[c].keys.length; d++) for (var i = 0; i < a.hierarchy[c].keys[d].morphTargets.length; i++) {
                                var k = a.hierarchy[c].keys[d].morphTargets[i];
                                h[k] = -1
                            }
                            a.hierarchy[c].usedMorphTargets = h;
                            for (d = 0; d < a.hierarchy[c].keys.length; d++) {
                                var j = {};
                                for (k in h) {
                                    for (i = 0; i < a.hierarchy[c].keys[d].morphTargets.length; i++) if (a.hierarchy[c].keys[d].morphTargets[i] === k) {
                                        j[k] = a.hierarchy[c].keys[d].morphTargetsInfluences[i];
                                        break
                                    }
                                    i === a.hierarchy[c].keys[d].morphTargets.length && (j[k] = 0)
                                }
                                a.hierarchy[c].keys[d].morphTargetsInfluences = j
                            }
                        }
                        for (d = 1; d < a.hierarchy[c].keys.length; d++) a.hierarchy[c].keys[d].time === a.hierarchy[c].keys[d - 1].time && (a.hierarchy[c].keys.splice(d, 1), d--);
                        for (d = 0; d < a.hierarchy[c].keys.length; d++) a.hierarchy[c].keys[d].index = d
                    }
                    d = parseInt(a.length * a.fps, 10);
                    a.JIT = {};
                    a.JIT.hierarchy = [];
                    for (c = 0; c < a.hierarchy.length; c++) a.JIT.hierarchy.push(Array(d));
                    a.initialized = !0
                }
            },
            get: function(a) {
                if ("string" === typeof a) {
                    if (b[a]) return b[a];
                    console.log("THREE.AnimationHandler.get: Couldn't find animation " + a);
                    return null
                }
            },
            parse: function(a) {
                var b = [];
                if (a instanceof THREE.SkinnedMesh) for (var c = 0; c < a.bones.length; c++) b.push(a.bones[c]);
                else d(a, b);
                return b
            }
        },
        d = function(a, b) {
            b.push(a);
            for (var c = 0; c < a.children.length; c++) d(a.children[c], b)
        };
    c.LINEAR = 0;
    c.CATMULLROM = 1;
    c.CATMULLROM_FORWARD = 2;
    return c
}();
THREE.Animation = function(a, b, c, d) {
    this.root = a;
    this.data = THREE.AnimationHandler.get(b);
    this.hierarchy = THREE.AnimationHandler.parse(a);
    this.currentTime = 0;
    this.timeScale = 1;
    this.isPlaying = !1;
    this.loop = this.isPaused = !0;
    this.interpolationType = void 0 !== c ? c : THREE.AnimationHandler.LINEAR;
    this.JITCompile = void 0 !== d ? d : !0;
    this.points = [];
    this.target = new THREE.Vector3
};
THREE.Animation.prototype.play = function(a, b) {
    if (!this.isPlaying) {
        this.isPlaying = !0;
        this.loop = void 0 !== a ? a : !0;
        this.currentTime = void 0 !== b ? b : 0;
        var c, d = this.hierarchy.length,
            f;
        for (c = 0; c < d; c++) {
            f = this.hierarchy[c];
            if (this.interpolationType !== THREE.AnimationHandler.CATMULLROM_FORWARD) f.useQuaternion = !0;
            f.matrixAutoUpdate = !0;
            if (void 0 === f.animationCache) f.animationCache = {}, f.animationCache.prevKey = {
                pos: 0,
                rot: 0,
                scl: 0
            }, f.animationCache.nextKey = {
                pos: 0,
                rot: 0,
                scl: 0
            }, f.animationCache.originalMatrix = f instanceof
            THREE.Bone ? f.skinMatrix : f.matrix;
            var g = f.animationCache.prevKey;
            f = f.animationCache.nextKey;
            g.pos = this.data.hierarchy[c].keys[0];
            g.rot = this.data.hierarchy[c].keys[0];
            g.scl = this.data.hierarchy[c].keys[0];
            f.pos = this.getNextKeyWith("pos", c, 1);
            f.rot = this.getNextKeyWith("rot", c, 1);
            f.scl = this.getNextKeyWith("scl", c, 1)
        }
        this.update(0)
    }
    this.isPaused = !1;
    THREE.AnimationHandler.addToUpdate(this)
};
THREE.Animation.prototype.pause = function() {
    this.isPaused ? THREE.AnimationHandler.addToUpdate(this) : THREE.AnimationHandler.removeFromUpdate(this);
    this.isPaused = !this.isPaused
};
THREE.Animation.prototype.stop = function() {
    this.isPaused = this.isPlaying = !1;
    THREE.AnimationHandler.removeFromUpdate(this);
    for (var a = 0; a < this.hierarchy.length; a++) if (void 0 !== this.hierarchy[a].animationCache) this.hierarchy[a] instanceof THREE.Bone ? this.hierarchy[a].skinMatrix = this.hierarchy[a].animationCache.originalMatrix : this.hierarchy[a].matrix = this.hierarchy[a].animationCache.originalMatrix, delete this.hierarchy[a].animationCache
};
THREE.Animation.prototype.update = function(a) {
    if (this.isPlaying) {
        var b = ["pos", "rot", "scl"],
            c, d, f, g, e, h, i, k, j = this.data.JIT.hierarchy,
            m, p;
        p = this.currentTime += a * this.timeScale;
        m = this.currentTime %= this.data.length;
        k = parseInt(Math.min(m * this.data.fps, this.data.length * this.data.fps), 10);
        for (var n = 0, l = this.hierarchy.length; n < l; n++) if (a = this.hierarchy[n], i = a.animationCache, this.JITCompile && void 0 !== j[n][k]) a instanceof THREE.Bone ? (a.skinMatrix = j[n][k], a.matrixAutoUpdate = !1, a.matrixWorldNeedsUpdate = !1) : (a.matrix = j[n][k], a.matrixAutoUpdate = !1, a.matrixWorldNeedsUpdate = !0);
        else {
            if (this.JITCompile) a instanceof THREE.Bone ? a.skinMatrix = a.animationCache.originalMatrix : a.matrix = a.animationCache.originalMatrix;
            for (var o = 0; 3 > o; o++) {
                c = b[o];
                e = i.prevKey[c];
                h = i.nextKey[c];
                if (h.time <= p) {
                    if (m < p) if (this.loop) {
                        e = this.data.hierarchy[n].keys[0];
                        for (h = this.getNextKeyWith(c, n, 1); h.time < m;) e = h, h = this.getNextKeyWith(c, n, h.index + 1)
                    } else {
                        this.stop();
                        return
                    } else {
                        do e = h, h = this.getNextKeyWith(c, n, h.index + 1);
                        while (h.time < m)
                    }
                    i.prevKey[c] = e;
                    i.nextKey[c] = h
                }
                a.matrixAutoUpdate = !0;
                a.matrixWorldNeedsUpdate = !0;
                d = (m - e.time) / (h.time - e.time);
                f = e[c];
                g = h[c];
                if (0 > d || 1 < d) console.log("THREE.Animation.update: Warning! Scale out of bounds:" + d + " on bone " + n), d = 0 > d ? 0 : 1;
                if ("pos" === c) if (c = a.position, this.interpolationType === THREE.AnimationHandler.LINEAR) c.x = f[0] + (g[0] - f[0]) * d, c.y = f[1] + (g[1] - f[1]) * d, c.z = f[2] + (g[2] - f[2]) * d;
                else {
                    if (this.interpolationType === THREE.AnimationHandler.CATMULLROM || this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD) if (this.points[0] = this.getPrevKeyWith("pos", n, e.index - 1).pos, this.points[1] = f, this.points[2] = g, this.points[3] = this.getNextKeyWith("pos", n, h.index + 1).pos, d = 0.33 * d + 0.33, f = this.interpolateCatmullRom(this.points, d), c.x = f[0], c.y = f[1], c.z = f[2], this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD) d = this.interpolateCatmullRom(this.points, 1.01 * d), this.target.set(d[0], d[1], d[2]), this.target.subSelf(c), this.target.y = 0, this.target.normalize(), d = Math.atan2(this.target.x, this.target.z), a.rotation.set(0, d, 0)
                } else if ("rot" === c) THREE.Quaternion.slerp(f, g, a.quaternion, d);
                else if ("scl" === c) c = a.scale, c.x = f[0] + (g[0] - f[0]) * d, c.y = f[1] + (g[1] - f[1]) * d, c.z = f[2] + (g[2] - f[2]) * d
            }
        }
        if (this.JITCompile && void 0 === j[0][k]) {
            this.hierarchy[0].updateMatrixWorld(!0);
            for (n = 0; n < this.hierarchy.length; n++) j[n][k] = this.hierarchy[n] instanceof THREE.Bone ? this.hierarchy[n].skinMatrix.clone() : this.hierarchy[n].matrix.clone()
        }
    }
};
THREE.Animation.prototype.interpolateCatmullRom = function(a, b) {
    var c = [],
        d = [],
        f, g, e, h, i, k;
    f = (a.length - 1) * b;
    g = Math.floor(f);
    f -= g;
    c[0] = 0 === g ? g : g - 1;
    c[1] = g;
    c[2] = g > a.length - 2 ? g : g + 1;
    c[3] = g > a.length - 3 ? g : g + 2;
    g = a[c[0]];
    h = a[c[1]];
    i = a[c[2]];
    k = a[c[3]];
    c = f * f;
    e = f * c;
    d[0] = this.interpolate(g[0], h[0], i[0], k[0], f, c, e);
    d[1] = this.interpolate(g[1], h[1], i[1], k[1], f, c, e);
    d[2] = this.interpolate(g[2], h[2], i[2], k[2], f, c, e);
    return d
};
THREE.Animation.prototype.interpolate = function(a, b, c, d, f, g, e) {
    a = 0.5 * (c - a);
    d = 0.5 * (d - b);
    return (2 * (b - c) + a + d) * e + (-3 * (b - c) - 2 * a - d) * g + a * f + b
};
THREE.Animation.prototype.getNextKeyWith = function(a, b, c) {
    for (var d = this.data.hierarchy[b].keys, c = this.interpolationType === THREE.AnimationHandler.CATMULLROM || this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD ? c < d.length - 1 ? c : d.length - 1 : c % d.length; c < d.length; c++) if (void 0 !== d[c][a]) return d[c];
    return this.data.hierarchy[b].keys[0]
};
THREE.Animation.prototype.getPrevKeyWith = function(a, b, c) {
    for (var d = this.data.hierarchy[b].keys, c = this.interpolationType === THREE.AnimationHandler.CATMULLROM || this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD ? 0 < c ? c : 0 : 0 <= c ? c : c + d.length; 0 <= c; c--) if (void 0 !== d[c][a]) return d[c];
    return this.data.hierarchy[b].keys[d.length - 1]
};
THREE.KeyFrameAnimation = function(a, b, c) {
    this.root = a;
    this.data = THREE.AnimationHandler.get(b);
    this.hierarchy = THREE.AnimationHandler.parse(a);
    this.currentTime = 0;
    this.timeScale = 0.001;
    this.isPlaying = !1;
    this.loop = this.isPaused = !0;
    this.JITCompile = void 0 !== c ? c : !0;
    a = 0;
    for (b = this.hierarchy.length; a < b; a++) {
        var c = this.data.hierarchy[a].sids,
            d = this.hierarchy[a];
        if (this.data.hierarchy[a].keys.length && c) {
            for (var f = 0; f < c.length; f++) {
                var g = c[f],
                    e = this.getNextKeyWith(g, a, 0);
                e && e.apply(g)
            }
            d.matrixAutoUpdate = !1;
            this.data.hierarchy[a].node.updateMatrix();
            d.matrixWorldNeedsUpdate = !0
        }
    }
};
THREE.KeyFrameAnimation.prototype.play = function(a, b) {
    if (!this.isPlaying) {
        this.isPlaying = !0;
        this.loop = void 0 !== a ? a : !0;
        this.currentTime = void 0 !== b ? b : 0;
        this.startTimeMs = b;
        this.startTime = 1E7;
        this.endTime = -this.startTime;
        var c, d = this.hierarchy.length,
            f, g;
        for (c = 0; c < d; c++) {
            f = this.hierarchy[c];
            g = this.data.hierarchy[c];
            f.useQuaternion = !0;
            if (void 0 === g.animationCache) g.animationCache = {}, g.animationCache.prevKey = null, g.animationCache.nextKey = null, g.animationCache.originalMatrix = f instanceof THREE.Bone ? f.skinMatrix : f.matrix;
            f = this.data.hierarchy[c].keys;
            if (f.length) g.animationCache.prevKey = f[0], g.animationCache.nextKey = f[1], this.startTime = Math.min(f[0].time, this.startTime), this.endTime = Math.max(f[f.length - 1].time, this.endTime)
        }
        this.update(0)
    }
    this.isPaused = !1;
    THREE.AnimationHandler.addToUpdate(this)
};
THREE.KeyFrameAnimation.prototype.pause = function() {
    this.isPaused ? THREE.AnimationHandler.addToUpdate(this) : THREE.AnimationHandler.removeFromUpdate(this);
    this.isPaused = !this.isPaused
};
THREE.KeyFrameAnimation.prototype.stop = function() {
    this.isPaused = this.isPlaying = !1;
    THREE.AnimationHandler.removeFromUpdate(this);
    for (var a = 0; a < this.hierarchy.length; a++) {
        var b = this.hierarchy[a];
        if (void 0 !== b.animationCache) {
            var c = b.animationCache.originalMatrix;
            b instanceof THREE.Bone ? (c.copy(b.skinMatrix), b.skinMatrix = c) : (c.copy(b.matrix), b.matrix = c);
            delete b.animationCache
        }
    }
};
THREE.KeyFrameAnimation.prototype.update = function(a) {
    if (this.isPlaying) {
        var b, c, d, f, g = this.data.JIT.hierarchy,
            e, h, i;
        h = this.currentTime += a * this.timeScale;
        e = this.currentTime %= this.data.length;
        if (e < this.startTimeMs) e = this.currentTime = this.startTimeMs + e;
        f = parseInt(Math.min(e * this.data.fps, this.data.length * this.data.fps), 10);
        if ((i = e < h) && !this.loop) {
            for (var a = 0, k = this.hierarchy.length; a < k; a++) {
                var j = this.data.hierarchy[a].keys,
                    g = this.data.hierarchy[a].sids;
                d = j.length - 1;
                f = this.hierarchy[a];
                if (j.length) {
                    for (j = 0; j < g.length; j++) e = g[j], (h = this.getPrevKeyWith(e, a, d)) && h.apply(e);
                    this.data.hierarchy[a].node.updateMatrix();
                    f.matrixWorldNeedsUpdate = !0
                }
            }
            this.stop()
        } else if (!(e < this.startTime)) {
            a = 0;
            for (k = this.hierarchy.length; a < k; a++) {
                d = this.hierarchy[a];
                b = this.data.hierarchy[a];
                var j = b.keys,
                    m = b.animationCache;
                if (this.JITCompile && void 0 !== g[a][f]) d instanceof THREE.Bone ? (d.skinMatrix = g[a][f], d.matrixWorldNeedsUpdate = !1) : (d.matrix = g[a][f], d.matrixWorldNeedsUpdate = !0);
                else if (j.length) {
                    if (this.JITCompile && m) d instanceof
                    THREE.Bone ? d.skinMatrix = m.originalMatrix : d.matrix = m.originalMatrix;
                    b = m.prevKey;
                    c = m.nextKey;
                    if (b && c) {
                        if (c.time <= h) {
                            if (i && this.loop) {
                                b = j[0];
                                for (c = j[1]; c.time < e;) b = c, c = j[b.index + 1]
                            } else if (!i) for (var p = j.length - 1; c.time < e && c.index !== p;) b = c, c = j[b.index + 1];
                            m.prevKey = b;
                            m.nextKey = c
                        }
                        b.interpolate(c, e)
                    }
                    this.data.hierarchy[a].node.updateMatrix();
                    d.matrixWorldNeedsUpdate = !0
                }
            }
            if (this.JITCompile && void 0 === g[0][f]) {
                this.hierarchy[0].updateMatrixWorld(!0);
                for (a = 0; a < this.hierarchy.length; a++) g[a][f] = this.hierarchy[a] instanceof
                THREE.Bone ? this.hierarchy[a].skinMatrix.clone() : this.hierarchy[a].matrix.clone()
            }
        }
    }
};
THREE.KeyFrameAnimation.prototype.getNextKeyWith = function(a, b, c) {
    b = this.data.hierarchy[b].keys;
    for (c %= b.length; c < b.length; c++) if (b[c].hasTarget(a)) return b[c];
    return b[0]
};
THREE.KeyFrameAnimation.prototype.getPrevKeyWith = function(a, b, c) {
    b = this.data.hierarchy[b].keys;
    for (c = 0 <= c ? c : c + b.length; 0 <= c; c--) if (b[c].hasTarget(a)) return b[c];
    return b[b.length - 1]
};
THREE.CubeCamera = function(a, b, c, d) {
    this.heightOffset = c;
    this.position = new THREE.Vector3(0, c, 0);
    this.cameraPX = new THREE.PerspectiveCamera(90, 1, a, b);
    this.cameraNX = new THREE.PerspectiveCamera(90, 1, a, b);
    this.cameraPY = new THREE.PerspectiveCamera(90, 1, a, b);
    this.cameraNY = new THREE.PerspectiveCamera(90, 1, a, b);
    this.cameraPZ = new THREE.PerspectiveCamera(90, 1, a, b);
    this.cameraNZ = new THREE.PerspectiveCamera(90, 1, a, b);
    this.cameraPX.position = this.position;
    this.cameraNX.position = this.position;
    this.cameraPY.position = this.position;
    this.cameraNY.position = this.position;
    this.cameraPZ.position = this.position;
    this.cameraNZ.position = this.position;
    this.cameraPX.up.set(0, -1, 0);
    this.cameraNX.up.set(0, -1, 0);
    this.cameraPY.up.set(0, 0, 1);
    this.cameraNY.up.set(0, 0, -1);
    this.cameraPZ.up.set(0, -1, 0);
    this.cameraNZ.up.set(0, -1, 0);
    this.targetPX = new THREE.Vector3(0, 0, 0);
    this.targetNX = new THREE.Vector3(0, 0, 0);
    this.targetPY = new THREE.Vector3(0, 0, 0);
    this.targetNY = new THREE.Vector3(0, 0, 0);
    this.targetPZ = new THREE.Vector3(0, 0, 0);
    this.targetNZ = new THREE.Vector3(0, 0, 0);
    this.renderTarget = new THREE.WebGLRenderTargetCube(d, d, {
        format: THREE.RGBFormat,
        magFilter: THREE.LinearFilter,
        minFilter: THREE.LinearFilter
    });
    this.updatePosition = function(a) {
        this.position.copy(a);
        this.position.y += this.heightOffset;
        this.targetPX.copy(this.position);
        this.targetNX.copy(this.position);
        this.targetPY.copy(this.position);
        this.targetNY.copy(this.position);
        this.targetPZ.copy(this.position);
        this.targetNZ.copy(this.position);
        this.targetPX.x += 1;
        this.targetNX.x -= 1;
        this.targetPY.y += 1;
        this.targetNY.y -= 1;
        this.targetPZ.z += 1;
        this.targetNZ.z -= 1;
        this.cameraPX.lookAt(this.targetPX);
        this.cameraNX.lookAt(this.targetNX);
        this.cameraPY.lookAt(this.targetPY);
        this.cameraNY.lookAt(this.targetNY);
        this.cameraPZ.lookAt(this.targetPZ);
        this.cameraNZ.lookAt(this.targetNZ)
    };
    this.updateCubeMap = function(a, b) {
        var c = this.renderTarget;
        c.activeCubeFace = 0;
        a.render(b, this.cameraPX, c);
        c.activeCubeFace = 1;
        a.render(b, this.cameraNX, c);
        c.activeCubeFace = 2;
        a.render(b, this.cameraPY, c);
        c.activeCubeFace = 3;
        a.render(b, this.cameraNY, c);
        c.activeCubeFace = 4;
        a.render(b, this.cameraPZ, c);
        c.activeCubeFace = 5;
        a.render(b, this.cameraNZ, c)
    }
};
THREE.FirstPersonCamera = function() {
    console.warn("DEPRECATED: FirstPersonCamera() is FirstPersonControls().")
};
THREE.PathCamera = function() {
    console.warn("DEPRECATED: PathCamera() is PathControls().")
};
THREE.FlyCamera = function() {
    console.warn("DEPRECATED: FlyCamera() is FlyControls().")
};
THREE.RollCamera = function() {
    console.warn("DEPRECATED: RollCamera() is RollControls().")
};
THREE.TrackballCamera = function() {
    console.warn("DEPRECATED: TrackballCamera() is TrackballControls().")
};
THREE.CombinedCamera = function(a, b, c, d, f, g, e) {
    THREE.Camera.call(this);
    this.fov = c;
    this.left = -a / 2;
    this.right = a / 2;
    this.top = b / 2;
    this.bottom = -b / 2;
    this.cameraO = new THREE.OrthographicCamera(a / -2, a / 2, b / 2, b / -2, g, e);
    this.cameraP = new THREE.PerspectiveCamera(c, a / b, d, f);
    this.zoom = 1;
    this.toPerspective()
};
THREE.CombinedCamera.prototype = new THREE.Camera;
THREE.CombinedCamera.prototype.constructor = THREE.CoolCamera;
THREE.CombinedCamera.prototype.toPerspective = function() {
    this.near = this.cameraP.near;
    this.far = this.cameraP.far;
    this.cameraP.fov = this.fov / this.zoom;
    this.cameraP.updateProjectionMatrix();
    this.projectionMatrix = this.cameraP.projectionMatrix;
    this.inPersepectiveMode = !0;
    this.inOrthographicMode = !1
};
THREE.CombinedCamera.prototype.toOrthographic = function() {
    var a = this.cameraP.aspect,
        b = (this.cameraP.near + this.cameraP.far) / 2,
        b = Math.tan(this.fov / 2) * b,
        a = 2 * b * a / 2,
        b = b / this.zoom,
        a = a / this.zoom;
    this.cameraO.left = -a;
    this.cameraO.right = a;
    this.cameraO.top = b;
    this.cameraO.bottom = -b;
    this.cameraO.updateProjectionMatrix();
    this.near = this.cameraO.near;
    this.far = this.cameraO.far;
    this.projectionMatrix = this.cameraO.projectionMatrix;
    this.inPersepectiveMode = !1;
    this.inOrthographicMode = !0
};
THREE.CombinedCamera.prototype.setFov = function(a) {
    this.fov = a;
    this.inPersepectiveMode ? this.toPerspective() : this.toOrthographic()
};
THREE.CombinedCamera.prototype.setLens = function(a, b) {
    b || (b = 43.25);
    var c = 2 * Math.atan(b / (2 * a)),
        c = 180 / Math.PI * c;
    this.setFov(c);
    return c
};
THREE.CombinedCamera.prototype.setZoom = function(a) {
    this.zoom = a;
    this.inPersepectiveMode ? this.toPerspective() : this.toOrthographic()
};
THREE.CombinedCamera.prototype.toFrontView = function() {
    this.rotation.x = 0;
    this.rotation.y = 0;
    this.rotation.z = 0;
    this.rotationAutoUpdate = !1
};
THREE.CombinedCamera.prototype.toBackView = function() {
    this.rotation.x = 0;
    this.rotation.y = Math.PI;
    this.rotation.z = 0;
    this.rotationAutoUpdate = !1
};
THREE.CombinedCamera.prototype.toLeftView = function() {
    this.rotation.x = 0;
    this.rotation.y = -Math.PI / 2;
    this.rotation.z = 0;
    this.rotationAutoUpdate = !1
};
THREE.CombinedCamera.prototype.toRightView = function() {
    this.rotation.x = 0;
    this.rotation.y = Math.PI / 2;
    this.rotation.z = 0;
    this.rotationAutoUpdate = !1
};
THREE.CombinedCamera.prototype.toTopView = function() {
    this.rotation.x = -Math.PI / 2;
    this.rotation.y = 0;
    this.rotation.z = 0;
    this.rotationAutoUpdate = !1
};
THREE.CombinedCamera.prototype.toBottomView = function() {
    this.rotation.x = Math.PI / 2;
    this.rotation.y = 0;
    this.rotation.z = 0;
    this.rotationAutoUpdate = !1
};
THREE.FirstPersonControls = function(a, b) {
    function c(a, b) {
        return function() {
            b.apply(a, arguments)
        }
    }
    this.object = a;
    this.target = new THREE.Vector3(0, 0, 0);
    this.domElement = void 0 !== b ? b : document;
    this.movementSpeed = 1;
    this.lookSpeed = 0.005;
    this.noFly = !1;
    this.lookVertical = !0;
    this.autoForward = !1;
    this.activeLook = !0;
    this.heightSpeed = !1;
    this.heightCoef = 1;
    this.heightMin = 0;
    this.constrainVertical = !1;
    this.verticalMin = 0;
    this.verticalMax = Math.PI;
    this.theta = this.phi = this.lon = this.lat = this.mouseY = this.mouseX = this.autoSpeedFactor = 0;
    this.mouseDragOn = this.freeze = this.moveRight = this.moveLeft = this.moveBackward = this.moveForward = !1;
    this.domElement === document ? (this.viewHalfX = window.innerWidth / 2, this.viewHalfY = window.innerHeight / 2) : (this.viewHalfX = this.domElement.offsetWidth / 2, this.viewHalfY = this.domElement.offsetHeight / 2, this.domElement.setAttribute("tabindex", -1));
    this.onMouseDown = function(a) {
        this.domElement !== document && this.domElement.focus();
        a.preventDefault();
        a.stopPropagation();
        if (this.activeLook) switch (a.button) {
        case 0:
            this.moveForward = !0;
            break;
        case 2:
            this.moveBackward = !0
        }
        this.mouseDragOn = !0
    };
    this.onMouseUp = function(a) {
        a.preventDefault();
        a.stopPropagation();
        if (this.activeLook) switch (a.button) {
        case 0:
            this.moveForward = !1;
            break;
        case 2:
            this.moveBackward = !1
        }
        this.mouseDragOn = !1
    };
    this.onMouseMove = function(a) {
        this.domElement === document ? (this.mouseX = a.pageX - this.viewHalfX, this.mouseY = a.pageY - this.viewHalfY) : (this.mouseX = a.pageX - this.domElement.offsetLeft - this.viewHalfX, this.mouseY = a.pageY - this.domElement.offsetTop - this.viewHalfY)
    };
    this.onKeyDown = function(a) {
        switch (a.keyCode) {
        case 38:
        case 87:
            this.moveForward = !0;
            break;
        case 37:
        case 65:
            this.moveLeft = !0;
            break;
        case 40:
        case 83:
            this.moveBackward = !0;
            break;
        case 39:
        case 68:
            this.moveRight = !0;
            break;
        case 82:
            this.moveUp = !0;
            break;
        case 70:
            this.moveDown = !0;
            break;
        case 81:
            this.freeze = !this.freeze
        }
    };
    this.onKeyUp = function(a) {
        switch (a.keyCode) {
        case 38:
        case 87:
            this.moveForward = !1;
            break;
        case 37:
        case 65:
            this.moveLeft = !1;
            break;
        case 40:
        case 83:
            this.moveBackward = !1;
            break;
        case 39:
        case 68:
            this.moveRight = !1;
            break;
        case 82:
            this.moveUp = !1;
            break;
        case 70:
            this.moveDown = !1
        }
    };
    this.update = function(a) {
        var b = 0;
        if (!this.freeze) {
            this.heightSpeed ? (b = THREE.Math.clamp(this.object.position.y, this.heightMin, this.heightMax) - this.heightMin, this.autoSpeedFactor = a * b * this.heightCoef) : this.autoSpeedFactor = 0;
            b = a * this.movementSpeed;
            (this.moveForward || this.autoForward && !this.moveBackward) && this.object.translateZ(-(b + this.autoSpeedFactor));
            this.moveBackward && this.object.translateZ(b);
            this.moveLeft && this.object.translateX(-b);
            this.moveRight && this.object.translateX(b);
            this.moveUp && this.object.translateY(b);
            this.moveDown && this.object.translateY(-b);
            a *= this.lookSpeed;
            this.activeLook || (a = 0);
            this.lon += this.mouseX * a;
            this.lookVertical && (this.lat -= this.mouseY * a);
            this.lat = Math.max(-85, Math.min(85, this.lat));
            this.phi = (90 - this.lat) * Math.PI / 180;
            this.theta = this.lon * Math.PI / 180;
            var b = this.target,
                c = this.object.position;
            b.x = c.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
            b.y = c.y + 100 * Math.cos(this.phi);
            b.z = c.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);
            b = 1;
            this.constrainVertical && (b = Math.PI / (this.verticalMax - this.verticalMin));
            this.lon += this.mouseX * a;
            this.lookVertical && (this.lat -= this.mouseY * a * b);
            this.lat = Math.max(-85, Math.min(85, this.lat));
            this.phi = (90 - this.lat) * Math.PI / 180;
            this.theta = this.lon * Math.PI / 180;
            if (this.constrainVertical) this.phi = THREE.Math.mapLinear(this.phi, 0, Math.PI, this.verticalMin, this.verticalMax);
            b = this.target;
            c = this.object.position;
            b.x = c.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
            b.y = c.y + 100 * Math.cos(this.phi);
            b.z = c.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);
            this.object.lookAt(b)
        }
    };
    this.domElement.addEventListener("contextmenu", function(a) {
        a.preventDefault()
    }, !1);
    this.domElement.addEventListener("mousemove", c(this, this.onMouseMove), !1);
    this.domElement.addEventListener("mousedown", c(this, this.onMouseDown), !1);
    this.domElement.addEventListener("mouseup", c(this, this.onMouseUp), !1);
    this.domElement.addEventListener("keydown", c(this, this.onKeyDown), !1);
    this.domElement.addEventListener("keyup", c(this, this.onKeyUp), !1)
};
THREE.PathControls = function(a, b) {
    function c(a) {
        return 1 > (a *= 2) ? 0.5 * a * a : -0.5 * (--a * (a - 2) - 1)
    }
    function d(a, b) {
        return function() {
            b.apply(a, arguments)
        }
    }
    function f(a, b, c, d) {
        var f = {
            name: c,
            fps: 0.6,
            length: d,
            hierarchy: []
        },
            e, g = b.getControlPointsArray(),
            h = b.getLength(),
            q = g.length,
            r = 0;
        e = q - 1;
        b = {
            parent: -1,
            keys: []
        };
        b.keys[0] = {
            time: 0,
            pos: g[0],
            rot: [0, 0, 0, 1],
            scl: [1, 1, 1]
        };
        b.keys[e] = {
            time: d,
            pos: g[e],
            rot: [0, 0, 0, 1],
            scl: [1, 1, 1]
        };
        for (e = 1; e < q - 1; e++) r = d * h.chunks[e] / h.total, b.keys[e] = {
            time: r,
            pos: g[e]
        };
        f.hierarchy[0] = b;
        THREE.AnimationHandler.add(f);
        return new THREE.Animation(a, c, THREE.AnimationHandler.CATMULLROM_FORWARD, !1)
    }
    function g(a, b) {
        var c, d, e = new THREE.Geometry;
        for (c = 0; c < a.points.length * b; c++) d = c / (a.points.length * b), d = a.getPoint(d), e.vertices[c] = new THREE.Vertex(new THREE.Vector3(d.x, d.y, d.z));
        return e
    }
    this.object = a;
    this.domElement = void 0 !== b ? b : document;
    this.id = "PathControls" + THREE.PathControlsIdCounter++;
    this.duration = 1E4;
    this.waypoints = [];
    this.useConstantSpeed = !0;
    this.resamplingCoef = 50;
    this.debugPath = new THREE.Object3D;
    this.debugDummy = new THREE.Object3D;
    this.animationParent = new THREE.Object3D;
    this.lookSpeed = 0.005;
    this.lookHorizontal = this.lookVertical = !0;
    this.verticalAngleMap = {
        srcRange: [0, 2 * Math.PI],
        dstRange: [0, 2 * Math.PI]
    };
    this.horizontalAngleMap = {
        srcRange: [0, 2 * Math.PI],
        dstRange: [0, 2 * Math.PI]
    };
    this.target = new THREE.Object3D;
    this.theta = this.phi = this.lon = this.lat = this.mouseY = this.mouseX = 0;
    this.domElement === document ? (this.viewHalfX = window.innerWidth / 2, this.viewHalfY = window.innerHeight / 2) : (this.viewHalfX = this.domElement.offsetWidth / 2, this.viewHalfY = this.domElement.offsetHeight / 2, this.domElement.setAttribute("tabindex", -1));
    var e = 2 * Math.PI,
        h = Math.PI / 180;
    this.update = function(a) {
        var b;
        this.lookHorizontal && (this.lon += this.mouseX * this.lookSpeed * a);
        this.lookVertical && (this.lat -= this.mouseY * this.lookSpeed * a);
        this.lon = Math.max(0, Math.min(360, this.lon));
        this.lat = Math.max(-85, Math.min(85, this.lat));
        this.phi = (90 - this.lat) * h;
        this.theta = this.lon * h;
        a = this.phi % e;
        this.phi = 0 <= a ? a : a + e;
        b = this.verticalAngleMap.srcRange;
        a = this.verticalAngleMap.dstRange;
        b = THREE.Math.mapLinear(this.phi, b[0], b[1], a[0], a[1]);
        var d = a[1] - a[0];
        this.phi = c((b - a[0]) / d) * d + a[0];
        b = this.horizontalAngleMap.srcRange;
        a = this.horizontalAngleMap.dstRange;
        b = THREE.Math.mapLinear(this.theta, b[0], b[1], a[0], a[1]);
        d = a[1] - a[0];
        this.theta = c((b - a[0]) / d) * d + a[0];
        a = this.target.position;
        a.x = 100 * Math.sin(this.phi) * Math.cos(this.theta);
        a.y = 100 * Math.cos(this.phi);
        a.z = 100 * Math.sin(this.phi) * Math.sin(this.theta);
        this.object.lookAt(this.target.position)
    };
    this.onMouseMove = function(a) {
        this.domElement === document ? (this.mouseX = a.pageX - this.viewHalfX, this.mouseY = a.pageY - this.viewHalfY) : (this.mouseX = a.pageX - this.domElement.offsetLeft - this.viewHalfX, this.mouseY = a.pageY - this.domElement.offsetTop - this.viewHalfY)
    };
    this.init = function() {
        this.spline = new THREE.Spline;
        this.spline.initFromArray(this.waypoints);
        this.useConstantSpeed && this.spline.reparametrizeByArcLength(this.resamplingCoef);
        if (this.createDebugDummy) {
            var a = new THREE.MeshLambertMaterial({
                color: 30719
            }),
                b = new THREE.MeshLambertMaterial({
                    color: 65280
                }),
                c = new THREE.CubeGeometry(10, 10, 20),
                e = new THREE.CubeGeometry(2, 2, 10);
            this.animationParent = new THREE.Mesh(c, a);
            a = new THREE.Mesh(e, b);
            a.position.set(0, 10, 0);
            this.animation = f(this.animationParent, this.spline, this.id, this.duration);
            this.animationParent.add(this.object);
            this.animationParent.add(this.target);
            this.animationParent.add(a)
        } else this.animation = f(this.animationParent, this.spline, this.id, this.duration), this.animationParent.add(this.target), this.animationParent.add(this.object);
        if (this.createDebugPath) {
            var a = this.debugPath,
                b = this.spline,
                e = g(b, 10),
                c = g(b, 10),
                h = new THREE.LineBasicMaterial({
                    color: 16711680,
                    linewidth: 3
                }),
                e = new THREE.Line(e, h),
                c = new THREE.ParticleSystem(c, new THREE.ParticleBasicMaterial({
                    color: 16755200,
                    size: 3
                }));
            e.scale.set(1, 1, 1);
            a.add(e);
            c.scale.set(1, 1, 1);
            a.add(c);
            for (var e = new THREE.SphereGeometry(1, 16, 8), h = new THREE.MeshBasicMaterial({
                color: 65280
            }), n = 0; n < b.points.length; n++) c = new THREE.Mesh(e, h), c.position.copy(b.points[n]), a.add(c)
        }
        this.domElement.addEventListener("mousemove", d(this, this.onMouseMove), !1)
    }
};
THREE.PathControlsIdCounter = 0;
THREE.FlyControls = function(a, b) {
    function c(a, b) {
        return function() {
            b.apply(a, arguments)
        }
    }
    this.object = a;
    this.domElement = void 0 !== b ? b : document;
    b && this.domElement.setAttribute("tabindex", -1);
    this.movementSpeed = 1;
    this.rollSpeed = 0.005;
    this.autoForward = this.dragToLook = !1;
    this.object.useQuaternion = !0;
    this.tmpQuaternion = new THREE.Quaternion;
    this.mouseStatus = 0;
    this.moveState = {
        up: 0,
        down: 0,
        left: 0,
        right: 0,
        forward: 0,
        back: 0,
        pitchUp: 0,
        pitchDown: 0,
        yawLeft: 0,
        yawRight: 0,
        rollLeft: 0,
        rollRight: 0
    };
    this.moveVector = new THREE.Vector3(0, 0, 0);
    this.rotationVector = new THREE.Vector3(0, 0, 0);
    this.handleEvent = function(a) {
        if ("function" == typeof this[a.type]) this[a.type](a)
    };
    this.keydown = function(a) {
        if (!a.altKey) {
            switch (a.keyCode) {
            case 16:
                this.movementSpeedMultiplier = 0.1;
                break;
            case 87:
                this.moveState.forward = 1;
                break;
            case 83:
                this.moveState.back = 1;
                break;
            case 65:
                this.moveState.left = 1;
                break;
            case 68:
                this.moveState.right = 1;
                break;
            case 82:
                this.moveState.up = 1;
                break;
            case 70:
                this.moveState.down = 1;
                break;
            case 38:
                this.moveState.pitchUp = 1;
                break;
            case 40:
                this.moveState.pitchDown = 1;
                break;
            case 37:
                this.moveState.yawLeft = 1;
                break;
            case 39:
                this.moveState.yawRight = 1;
                break;
            case 81:
                this.moveState.rollLeft = 1;
                break;
            case 69:
                this.moveState.rollRight = 1
            }
            this.updateMovementVector();
            this.updateRotationVector()
        }
    };
    this.keyup = function(a) {
        switch (a.keyCode) {
        case 16:
            this.movementSpeedMultiplier = 1;
            break;
        case 87:
            this.moveState.forward = 0;
            break;
        case 83:
            this.moveState.back = 0;
            break;
        case 65:
            this.moveState.left = 0;
            break;
        case 68:
            this.moveState.right = 0;
            break;
        case 82:
            this.moveState.up = 0;
            break;
        case 70:
            this.moveState.down = 0;
            break;
        case 38:
            this.moveState.pitchUp = 0;
            break;
        case 40:
            this.moveState.pitchDown = 0;
            break;
        case 37:
            this.moveState.yawLeft = 0;
            break;
        case 39:
            this.moveState.yawRight = 0;
            break;
        case 81:
            this.moveState.rollLeft = 0;
            break;
        case 69:
            this.moveState.rollRight = 0
        }
        this.updateMovementVector();
        this.updateRotationVector()
    };
    this.mousedown = function(a) {
        this.domElement !== document && this.domElement.focus();
        a.preventDefault();
        a.stopPropagation();
        if (this.dragToLook) this.mouseStatus++;
        else switch (a.button) {
        case 0:
            this.object.moveForward = !0;
            break;
        case 2:
            this.object.moveBackward = !0
        }
    };
    this.mousemove = function(a) {
        if (!this.dragToLook || 0 < this.mouseStatus) {
            var b = this.getContainerDimensions(),
                c = b.size[0] / 2,
                e = b.size[1] / 2;
            this.moveState.yawLeft = -(a.pageX - b.offset[0] - c) / c;
            this.moveState.pitchDown = (a.pageY - b.offset[1] - e) / e;
            this.updateRotationVector()
        }
    };
    this.mouseup = function(a) {
        a.preventDefault();
        a.stopPropagation();
        if (this.dragToLook) this.mouseStatus--, this.moveState.yawLeft = this.moveState.pitchDown = 0;
        else switch (a.button) {
        case 0:
            this.moveForward = !1;
            break;
        case 2:
            this.moveBackward = !1
        }
        this.updateRotationVector()
    };
    this.update = function(a) {
        var b = a * this.movementSpeed,
            a = a * this.rollSpeed;
        this.object.translateX(this.moveVector.x * b);
        this.object.translateY(this.moveVector.y * b);
        this.object.translateZ(this.moveVector.z * b);
        this.tmpQuaternion.set(this.rotationVector.x * a, this.rotationVector.y * a, this.rotationVector.z * a, 1).normalize();
        this.object.quaternion.multiplySelf(this.tmpQuaternion);
        this.object.matrix.setPosition(this.object.position);
        this.object.matrix.setRotationFromQuaternion(this.object.quaternion);
        this.object.matrixWorldNeedsUpdate = !0
    };
    this.updateMovementVector = function() {
        var a = this.moveState.forward || this.autoForward && !this.moveState.back ? 1 : 0;
        this.moveVector.x = -this.moveState.left + this.moveState.right;
        this.moveVector.y = -this.moveState.down + this.moveState.up;
        this.moveVector.z = -a + this.moveState.back
    };
    this.updateRotationVector = function() {
        this.rotationVector.x = -this.moveState.pitchDown + this.moveState.pitchUp;
        this.rotationVector.y = -this.moveState.yawRight + this.moveState.yawLeft;
        this.rotationVector.z = -this.moveState.rollRight + this.moveState.rollLeft
    };
    this.getContainerDimensions = function() {
        return this.domElement != document ? {
            size: [this.domElement.offsetWidth, this.domElement.offsetHeight],
            offset: [this.domElement.offsetLeft, this.domElement.offsetTop]
        } : {
            size: [window.innerWidth, window.innerHeight],
            offset: [0, 0]
        }
    };
    this.domElement.addEventListener("mousemove", c(this, this.mousemove), !1);
    this.domElement.addEventListener("mousedown", c(this, this.mousedown), !1);
    this.domElement.addEventListener("mouseup", c(this, this.mouseup), !1);
    this.domElement.addEventListener("keydown", c(this, this.keydown), !1);
    this.domElement.addEventListener("keyup", c(this, this.keyup), !1);
    this.updateMovementVector();
    this.updateRotationVector()
};
THREE.RollControls = function(a, b) {
    this.object = a;
    this.domElement = void 0 !== b ? b : document;
    this.mouseLook = !0;
    this.autoForward = !1;
    this.rollSpeed = this.movementSpeed = this.lookSpeed = 1;
    this.constrainVertical = [-0.9, 0.9];
    this.object.matrixAutoUpdate = !1;
    this.forward = new THREE.Vector3(0, 0, 1);
    this.roll = 0;
    var c = new THREE.Vector3,
        d = new THREE.Vector3,
        f = new THREE.Vector3,
        g = new THREE.Matrix4,
        e = !1,
        h = 1,
        i = 0,
        k = 0,
        j = 0,
        m = 0,
        p = 0,
        n = window.innerWidth / 2,
        l = window.innerHeight / 2;
    this.update = function(a) {
        if (this.mouseLook) {
            var b = a * this.lookSpeed;
            this.rotateHorizontally(b * m);
            this.rotateVertically(b * p)
        }
        b = a * this.movementSpeed;
        this.object.translateZ(-b * (0 < i || this.autoForward && !(0 > i) ? 1 : i));
        this.object.translateX(b * k);
        this.object.translateY(b * j);
        e && (this.roll += this.rollSpeed * a * h);
        if (this.forward.y > this.constrainVertical[1]) this.forward.y = this.constrainVertical[1], this.forward.normalize();
        else if (this.forward.y < this.constrainVertical[0]) this.forward.y = this.constrainVertical[0], this.forward.normalize();
        f.copy(this.forward);
        d.set(0, 1, 0);
        c.cross(d, f).normalize();
        d.cross(f, c).normalize();
        this.object.matrix.n11 = c.x;
        this.object.matrix.n12 = d.x;
        this.object.matrix.n13 = f.x;
        this.object.matrix.n21 = c.y;
        this.object.matrix.n22 = d.y;
        this.object.matrix.n23 = f.y;
        this.object.matrix.n31 = c.z;
        this.object.matrix.n32 = d.z;
        this.object.matrix.n33 = f.z;
        g.identity();
        g.n11 = Math.cos(this.roll);
        g.n12 = -Math.sin(this.roll);
        g.n21 = Math.sin(this.roll);
        g.n22 = Math.cos(this.roll);
        this.object.matrix.multiplySelf(g);
        this.object.matrixWorldNeedsUpdate = !0;
        this.object.matrix.n14 = this.object.position.x;
        this.object.matrix.n24 = this.object.position.y;
        this.object.matrix.n34 = this.object.position.z
    };
    this.translateX = function(a) {
        this.object.position.x += this.object.matrix.n11 * a;
        this.object.position.y += this.object.matrix.n21 * a;
        this.object.position.z += this.object.matrix.n31 * a
    };
    this.translateY = function(a) {
        this.object.position.x += this.object.matrix.n12 * a;
        this.object.position.y += this.object.matrix.n22 * a;
        this.object.position.z += this.object.matrix.n32 * a
    };
    this.translateZ = function(a) {
        this.object.position.x -= this.object.matrix.n13 * a;
        this.object.position.y -= this.object.matrix.n23 * a;
        this.object.position.z -= this.object.matrix.n33 * a
    };
    this.rotateHorizontally = function(a) {
        c.set(this.object.matrix.n11, this.object.matrix.n21, this.object.matrix.n31);
        c.multiplyScalar(a);
        this.forward.subSelf(c);
        this.forward.normalize()
    };
    this.rotateVertically = function(a) {
        d.set(this.object.matrix.n12, this.object.matrix.n22, this.object.matrix.n32);
        d.multiplyScalar(a);
        this.forward.addSelf(d);
        this.forward.normalize()
    };
    this.domElement.addEventListener("contextmenu", function(a) {
        a.preventDefault()
    }, !1);
    this.domElement.addEventListener("mousemove", function(a) {
        m = (a.clientX - n) / window.innerWidth;
        p = (a.clientY - l) / window.innerHeight
    }, !1);
    this.domElement.addEventListener("mousedown", function(a) {
        a.preventDefault();
        a.stopPropagation();
        switch (a.button) {
        case 0:
            i = 1;
            break;
        case 2:
            i = -1
        }
    }, !1);
    this.domElement.addEventListener("mouseup", function(a) {
        a.preventDefault();
        a.stopPropagation();
        switch (a.button) {
        case 0:
            i = 0;
            break;
        case 2:
            i = 0
        }
    }, !1);
    this.domElement.addEventListener("keydown", function(a) {
        switch (a.keyCode) {
        case 38:
        case 87:
            i = 1;
            break;
        case 37:
        case 65:
            k = -1;
            break;
        case 40:
        case 83:
            i = -1;
            break;
        case 39:
        case 68:
            k = 1;
            break;
        case 81:
            e = !0;
            h = 1;
            break;
        case 69:
            e = !0;
            h = -1;
            break;
        case 82:
            j = 1;
            break;
        case 70:
            j = -1
        }
    }, !1);
    this.domElement.addEventListener("keyup", function(a) {
        switch (a.keyCode) {
        case 38:
        case 87:
            i = 0;
            break;
        case 37:
        case 65:
            k = 0;
            break;
        case 40:
        case 83:
            i = 0;
            break;
        case 39:
        case 68:
            k = 0;
            break;
        case 81:
            e = !1;
            break;
        case 69:
            e = !1;
            break;
        case 82:
            j = 0;
            break;
        case 70:
            j = 0
        }
    }, !1)
};
THREE.TrackballControls = function(a, b) {
    var c = this;
    this.object = a;
    this.domElement = void 0 !== b ? b : document;
    this.enabled = !0;
    this.screen = {
        width: window.innerWidth,
        height: window.innerHeight,
        offsetLeft: 0,
        offsetTop: 0
    };
    this.radius = (this.screen.width + this.screen.height) / 4;
    this.rotateSpeed = 1;
    this.zoomSpeed = 1.2;
    this.panSpeed = 0.3;
    this.staticMoving = this.noPan = this.noZoom = this.noRotate = !1;
    this.dynamicDampingFactor = 0.2;
    this.minDistance = 0;
    this.maxDistance = Infinity;
    this.keys = [65, 83, 68];
    this.target = new THREE.Vector3(0, 0, 0);
    var d = !1,
        f = -1,
        g = new THREE.Vector3,
        e = new THREE.Vector3,
        h = new THREE.Vector3,
        i = new THREE.Vector2,
        k = new THREE.Vector2,
        j = new THREE.Vector2,
        m = new THREE.Vector2;
    this.handleEvent = function(a) {
        if ("function" == typeof this[a.type]) this[a.type](a)
    };
    this.getMouseOnScreen = function(a, b) {
        return new THREE.Vector2(0.5 * ((a - c.screen.offsetLeft) / c.radius), 0.5 * ((b - c.screen.offsetTop) / c.radius))
    };
    this.getMouseProjectionOnBall = function(a, b) {
        var d = new THREE.Vector3((a - 0.5 * c.screen.width - c.screen.offsetLeft) / c.radius, (0.5 * c.screen.height + c.screen.offsetTop - b) / c.radius, 0),
            e = d.length();
        1 < e ? d.normalize() : d.z = Math.sqrt(1 - e * e);
        g.copy(c.object.position).subSelf(c.target);
        e = c.object.up.clone().setLength(d.y);
        e.addSelf(c.object.up.clone().crossSelf(g).setLength(d.x));
        e.addSelf(g.setLength(d.z));
        return e
    };
    this.rotateCamera = function() {
        var a = Math.acos(e.dot(h) / e.length() / h.length());
        if (a) {
            var b = (new THREE.Vector3).cross(e, h).normalize(),
                d = new THREE.Quaternion,
                a = a * c.rotateSpeed;
            d.setFromAxisAngle(b, -a);
            d.multiplyVector3(g);
            d.multiplyVector3(c.object.up);
            d.multiplyVector3(h);
            c.staticMoving ? e = h : (d.setFromAxisAngle(b, a * (c.dynamicDampingFactor - 1)), d.multiplyVector3(e))
        }
    };
    this.zoomCamera = function() {
        var a = 1 + (k.y - i.y) * c.zoomSpeed;
        1 !== a && 0 < a && (g.multiplyScalar(a), c.staticMoving ? i = k : i.y += (k.y - i.y) * this.dynamicDampingFactor)
    };
    this.panCamera = function() {
        var a = m.clone().subSelf(j);
        if (a.lengthSq()) {
            a.multiplyScalar(g.length() * c.panSpeed);
            var b = g.clone().crossSelf(c.object.up).setLength(a.x);
            b.addSelf(c.object.up.clone().setLength(a.y));
            c.object.position.addSelf(b);
            c.target.addSelf(b);
            c.staticMoving ? j = m : j.addSelf(a.sub(m, j).multiplyScalar(c.dynamicDampingFactor))
        }
    };
    this.checkDistances = function() {
        if (!c.noZoom || !c.noPan) c.object.position.lengthSq() > c.maxDistance * c.maxDistance && c.object.position.setLength(c.maxDistance), g.lengthSq() < c.minDistance * c.minDistance && c.object.position.add(c.target, g.setLength(c.minDistance))
    };
    this.update = function() {
        g.copy(c.object.position).subSelf(this.target);
        c.noRotate || c.rotateCamera();
        c.noZoom || c.zoomCamera();
        c.noPan || c.panCamera();
        c.object.position.add(c.target, g);
        c.checkDistances();
        c.object.lookAt(c.target)
    };
    this.domElement.addEventListener("contextmenu", function(a) {
        a.preventDefault()
    }, !1);
    this.domElement.addEventListener("mousemove", function(a) {
        c.enabled && (d && (e = h = c.getMouseProjectionOnBall(a.clientX, a.clientY), i = k = c.getMouseOnScreen(a.clientX, a.clientY), j = m = c.getMouseOnScreen(a.clientX, a.clientY), d = !1), -1 !== f && (0 === f && !c.noRotate ? h = c.getMouseProjectionOnBall(a.clientX, a.clientY) : 1 === f && !c.noZoom ? k = c.getMouseOnScreen(a.clientX, a.clientY) : 2 === f && !c.noPan && (m = c.getMouseOnScreen(a.clientX, a.clientY))))
    }, !1);
    this.domElement.addEventListener("mousedown", function(a) {
        if (c.enabled && (a.preventDefault(), a.stopPropagation(), -1 === f)) f = a.button, 0 === f && !c.noRotate ? e = h = c.getMouseProjectionOnBall(a.clientX, a.clientY) : 1 === f && !c.noZoom ? i = k = c.getMouseOnScreen(a.clientX, a.clientY) : this.noPan || (j = m = c.getMouseOnScreen(a.clientX, a.clientY))
    }, !1);
    this.domElement.addEventListener("mouseup", function(a) {
        c.enabled && (a.preventDefault(), a.stopPropagation(), f = -1)
    }, !1);
    window.addEventListener("keydown", function(a) {
        c.enabled && -1 === f && (a.keyCode === c.keys[0] && !c.noRotate ? f = 0 : a.keyCode === c.keys[1] && !c.noZoom ? f = 1 : a.keyCode === c.keys[2] && !c.noPan && (f = 2), -1 !== f && (d = !0))
    }, !1);
    window.addEventListener("keyup", function() {
        c.enabled && -1 !== f && (f = -1)
    }, !1)
};
THREE.CubeGeometry = function(a, b, c, d, f, g, e, h) {
    function i(a, b, c, e, h, i, j, m) {
        var l, p = d || 1,
            o = f || 1,
            n = h / 2,
            r = i / 2,
            q = k.vertices.length;
        if ("x" === a && "y" === b || "y" === a && "x" === b) l = "z";
        else if ("x" === a && "z" === b || "z" === a && "x" === b) l = "y", o = g || 1;
        else if ("z" === a && "y" === b || "y" === a && "z" === b) l = "x", p = g || 1;
        var s = p + 1,
            t = o + 1,
            C = h / p,
            L = i / o,
            N = new THREE.Vector3;
        N[l] = 0 < j ? 1 : -1;
        for (h = 0; h < t; h++) for (i = 0; i < s; i++) {
            var M = new THREE.Vector3;
            M[a] = (i * C - n) * c;
            M[b] = (h * L - r) * e;
            M[l] = j;
            k.vertices.push(new THREE.Vertex(M))
        }
        for (h = 0; h < o; h++) for (i = 0; i < p; i++) a = new THREE.Face4(i + s * h + q, i + s * (h + 1) + q, i + 1 + s * (h + 1) + q, i + 1 + s * h + q), a.normal.copy(N), a.vertexNormals.push(N.clone(), N.clone(), N.clone(), N.clone()), a.materialIndex = m, k.faces.push(a), k.faceVertexUvs[0].push([new THREE.UV(i / p, h / o), new THREE.UV(i / p, (h + 1) / o), new THREE.UV((i + 1) / p, (h + 1) / o), new THREE.UV((i + 1) / p, h / o)])
    }
    THREE.Geometry.call(this);
    var k = this,
        j = a / 2,
        m = b / 2,
        p = c / 2,
        n, l, o, q, r, s;
    if (void 0 !== e) {
        if (e instanceof Array) this.materials = e;
        else {
            this.materials = [];
            for (n = 0; 6 > n; n++) this.materials.push(e)
        }
        n = 0;
        q = 1;
        l = 2;
        r = 3;
        o = 4;
        s = 5
    } else this.materials = [];
    this.sides = {
        px: !0,
        nx: !0,
        py: !0,
        ny: !0,
        pz: !0,
        nz: !0
    };
    if (void 0 != h) for (var t in h) void 0 !== this.sides[t] && (this.sides[t] = h[t]);
    this.sides.px && i("z", "y", -1, -1, c, b, j, n);
    this.sides.nx && i("z", "y", 1, -1, c, b, -j, q);
    this.sides.py && i("x", "z", 1, 1, a, c, m, l);
    this.sides.ny && i("x", "z", 1, -1, a, c, -m, r);
    this.sides.pz && i("x", "y", 1, -1, a, b, p, o);
    this.sides.nz && i("x", "y", -1, -1, a, b, -p, s);
    this.computeCentroids();
    this.mergeVertices()
};
THREE.CubeGeometry.prototype = new THREE.Geometry;
THREE.CubeGeometry.prototype.constructor = THREE.CubeGeometry;
THREE.CylinderGeometry = function(a, b, c, d, f, g) {
    THREE.Geometry.call(this);
    var a = void 0 !== a ? a : 20,
        b = void 0 !== b ? b : 20,
        c = void 0 !== c ? c : 100,
        e = c / 2,
        d = d || 8,
        f = f || 1,
        h, i, k = [],
        j = [];
    for (i = 0; i <= f; i++) {
        var m = [],
            p = [],
            n = i / f,
            l = n * (b - a) + a;
        for (h = 0; h <= d; h++) {
            var o = h / d,
                q = l * Math.sin(2 * o * Math.PI),
                r = -n * c + e,
                s = l * Math.cos(2 * o * Math.PI);
            this.vertices.push(new THREE.Vertex(new THREE.Vector3(q, r, s)));
            m.push(this.vertices.length - 1);
            p.push(new THREE.UV(o, n))
        }
        k.push(m);
        j.push(p)
    }
    for (i = 0; i < f; i++) for (h = 0; h < d; h++) {
        var c = k[i][h],
            m = k[i + 1][h],
            p = k[i + 1][h + 1],
            n = k[i][h + 1],
            l = this.vertices[c].position.clone().setY(0).normalize(),
            o = this.vertices[m].position.clone().setY(0).normalize(),
            q = this.vertices[p].position.clone().setY(0).normalize(),
            r = this.vertices[n].position.clone().setY(0).normalize(),
            s = j[i][h].clone(),
            t = j[i + 1][h].clone(),
            v = j[i + 1][h + 1].clone(),
            u = j[i][h + 1].clone();
        this.faces.push(new THREE.Face4(c, m, p, n, [l, o, q, r]));
        this.faceVertexUvs[0].push([s, t, v, u])
    }
    if (!g && 0 < a) {
        this.vertices.push(new THREE.Vertex(new THREE.Vector3(0, e, 0)));
        for (h = 0; h < d; h++) c = k[0][h], m = k[0][h + 1], p = this.vertices.length - 1, l = new THREE.Vector3(0, 1, 0), o = new THREE.Vector3(0, 1, 0), q = new THREE.Vector3(0, 1, 0), s = j[0][h].clone(), t = j[0][h + 1].clone(), v = new THREE.UV(t.u, 0), this.faces.push(new THREE.Face3(c, m, p, [l, o, q])), this.faceVertexUvs[0].push([s, t, v])
    }
    if (!g && 0 < b) {
        this.vertices.push(new THREE.Vertex(new THREE.Vector3(0, -e, 0)));
        for (h = 0; h < d; h++) c = k[i][h + 1], m = k[i][h], p = this.vertices.length - 1, l = new THREE.Vector3(0, -1, 0), o = new THREE.Vector3(0, -1, 0), q = new THREE.Vector3(0, -1, 0), s = j[i][h + 1].clone(), t = j[i][h].clone(), v = new THREE.UV(t.u, 1), this.faces.push(new THREE.Face3(c, m, p, [l, o, q])), this.faceVertexUvs[0].push([s, t, v])
    }
    this.computeCentroids();
    this.computeFaceNormals()
};
THREE.CylinderGeometry.prototype = new THREE.Geometry;
THREE.CylinderGeometry.prototype.constructor = THREE.CylinderGeometry;
THREE.ExtrudeGeometry = function(a, b) {
    if ("undefined" !== typeof a) {
        THREE.Geometry.call(this);
        var a = a instanceof Array ? a : [a],
            c, d, f = a.length;
        this.shapebb = a[f - 1].getBoundingBox();
        for (d = 0; d < f; d++) c = a[d], this.addShape(c, b);
        this.computeCentroids();
        this.computeFaceNormals()
    }
};
THREE.ExtrudeGeometry.prototype = new THREE.Geometry;
THREE.ExtrudeGeometry.prototype.constructor = THREE.ExtrudeGeometry;
THREE.ExtrudeGeometry.prototype.addShape = function(a, b) {
    function c(a, b, c) {
        b || console.log("die");
        return b.clone().multiplyScalar(c).addSelf(a)
    }
    function d(a, b, c) {
        var d = THREE.ExtrudeGeometry.__v1,
            e = THREE.ExtrudeGeometry.__v2,
            f = THREE.ExtrudeGeometry.__v3,
            g = THREE.ExtrudeGeometry.__v4,
            h = THREE.ExtrudeGeometry.__v5,
            i = THREE.ExtrudeGeometry.__v6;
        d.set(a.x - b.x, a.y - b.y);
        e.set(a.x - c.x, a.y - c.y);
        d = d.normalize();
        e = e.normalize();
        f.set(-d.y, d.x);
        g.set(e.y, -e.x);
        h.copy(a).addSelf(f);
        i.copy(a).addSelf(g);
        if (h.equals(i)) return g.clone();
        h.copy(b).addSelf(f);
        i.copy(c).addSelf(g);
        f = d.dot(g);
        g = i.subSelf(h).dot(g);
        0 === f && (console.log("Either infinite or no solutions!"), 0 === g ? console.log("Its finite solutions.") : console.log("Too bad, no solutions."));
        g /= f;
        return 0 > g ? (b = Math.atan2(b.y - a.y, b.x - a.x), a = Math.atan2(c.y - a.y, c.x - a.x), b > a && (a += 2 * Math.PI), c = (b + a) / 2, a = -Math.cos(c), c = -Math.sin(c), new THREE.Vector2(a, c)) : d.multiplyScalar(g).addSelf(h).subSelf(a).clone()
    }
    function f(a) {
        for (y = a.length; 0 <= --y;) {
            C = y;
            L = y - 1;
            0 > L && (L = a.length - 1);
            for (var b = 0, c = n + 2 * j, b = 0; b < c; b++) {
                var d = G * b,
                    e = G * (b + 1),
                    f = R + C + d,
                    g = R + C + e,
                    k = f,
                    d = R + L + d,
                    e = R + L + e,
                    m = g,
                    k = k + F,
                    d = d + F,
                    e = e + F,
                    m = m + F;
                A.faces.push(new THREE.Face4(k, d, e, m, null, null, v));
                void 0 !== v && (k = b / c, d = (b + 1) / c, e = h + 2 * i, f = (A.vertices[f].position.z + i) / e, g = (A.vertices[g].position.z + i) / e, A.faceVertexUvs[0].push([new THREE.UV(f, k), new THREE.UV(g, k), new THREE.UV(g, d), new THREE.UV(f, d)]))
            }
        }
    }
    function g(a, b, c) {
        A.vertices.push(new THREE.Vertex(new THREE.Vector3(a, b, c)))
    }
    function e(a, b, c) {
        a += F;
        b += F;
        c += F;
        A.faces.push(new THREE.Face3(a, b, c, null, null, t));
        if (void 0 !== t) {
            var d = u.minX,
                e = u.minY,
                f = u.maxY,
                g = u.maxX,
                h = A.vertices[b].position.x - d,
                b = A.vertices[b].position.y - e,
                i = A.vertices[c].position.x - d,
                c = A.vertices[c].position.y - e;
            A.faceVertexUvs[0].push([new THREE.UV((A.vertices[a].position.x - d) / g, (A.vertices[a].position.y - e) / f), new THREE.UV(h / g, b / f), new THREE.UV(i / g, c / f)])
        }
    }
    var h = void 0 !== b.amount ? b.amount : 100,
        i = void 0 !== b.bevelThickness ? b.bevelThickness : 6,
        k = void 0 !== b.bevelSize ? b.bevelSize : i - 2,
        j = void 0 !== b.bevelSegments ? b.bevelSegments : 3,
        m = void 0 !== b.bevelEnabled ? b.bevelEnabled : !0,
        p = void 0 !== b.curveSegments ? b.curveSegments : 12,
        n = void 0 !== b.steps ? b.steps : 1,
        l = b.bendPath,
        o = b.extrudePath,
        q, r = !1,
        s = void 0 !== b.useSpacedPoints ? b.useSpacedPoints : !1,
        t = b.material,
        v = b.extrudeMaterial,
        u = this.shapebb;
    if (o) q = o.getPoints(p), n = q.length, r = !0, m = !1;
    m || (k = i = j = 0);
    var w, z, x, A = this,
        F = this.vertices.length;
    l && a.addWrapPath(l);
    p = s ? a.extractAllSpacedPoints(p) : a.extractAllPoints(p);
    l = p.shape;
    p = p.holes;
    if (o = !THREE.Shape.Utils.isClockWise(l)) {
        l = l.reverse();
        for (z = 0, x = p.length; z < x; z++) w = p[z], THREE.Shape.Utils.isClockWise(w) && (p[z] = w.reverse());
        o = !1
    }
    o = THREE.Shape.Utils.triangulateShape(l, p);
    s = l;
    for (z = 0, x = p.length; z < x; z++) w = p[z], l = l.concat(w);
    for (var E, I, J, B, G = l.length, D = o.length, H = [], y = 0, K = s.length, C = K - 1, L = y + 1; y < K; y++, C++, L++) C === K && (C = 0), L === K && (L = 0), H[y] = d(s[y], s[C], s[L]);
    var N = [],
        M, O = H.concat();
    for (z = 0, x = p.length; z < x; z++) {
        w = p[z];
        M = [];
        for (y = 0, K = w.length, C = K - 1, L = y + 1; y < K; y++, C++, L++) C === K && (C = 0), L === K && (L = 0), M[y] = d(w[y], w[C], w[L]);
        N.push(M);
        O = O.concat(M)
    }
    for (E = 0; E < j; E++) {
        I = E / j;
        J = i * (1 - I);
        I = k * Math.sin(I * Math.PI / 2);
        for (y = 0, K = s.length; y < K; y++) B = c(s[y], H[y], I), g(B.x, B.y, -J);
        for (z = 0, x = p.length; z < x; z++) {
            w = p[z];
            M = N[z];
            for (y = 0, K = w.length; y < K; y++) B = c(w[y], M[y], I), g(B.x, B.y, -J)
        }
    }
    I = k;
    for (y = 0; y < G; y++) B = m ? c(l[y], O[y], I) : l[y], r ? g(B.x, B.y + q[0].y, q[0].x) : g(B.x, B.y, 0);
    for (E = 1; E <= n; E++) for (y = 0; y < G; y++) B = m ? c(l[y], O[y], I) : l[y], r ? g(B.x, B.y + q[E - 1].y, q[E - 1].x) : g(B.x, B.y, h / n * E);
    for (E = j - 1; 0 <= E; E--) {
        I = E / j;
        J = i * (1 - I);
        I = k * Math.sin(I * Math.PI / 2);
        for (y = 0, K = s.length; y < K; y++) B = c(s[y], H[y], I), g(B.x, B.y, h + J);
        for (z = 0, x = p.length; z < x; z++) {
            w = p[z];
            M = N[z];
            for (y = 0, K = w.length; y < K; y++) B = c(w[y], M[y], I), r ? g(B.x, B.y + q[n - 1].y, q[n - 1].x + J) : g(B.x, B.y, h + J)
        }
    }
    if (m) {
        m = 0 * G;
        for (y = 0; y < D; y++) k = o[y], e(k[2] + m, k[1] + m, k[0] + m);
        m = G * (n + 2 * j);
        for (y = 0; y < D; y++) k = o[y], e(k[0] + m, k[1] + m, k[2] + m)
    } else {
        for (y = 0; y < D; y++) k = o[y], e(k[2], k[1], k[0]);
        for (y = 0; y < D; y++) k = o[y], e(k[0] + G * n, k[1] + G * n, k[2] + G * n)
    }
    var R = 0;
    f(s);
    R += s.length;
    for (z = 0, x = p.length; z < x; z++) w = p[z], f(w), R += w.length
};
THREE.ExtrudeGeometry.__v1 = new THREE.Vector2;
THREE.ExtrudeGeometry.__v2 = new THREE.Vector2;
THREE.ExtrudeGeometry.__v3 = new THREE.Vector2;
THREE.ExtrudeGeometry.__v4 = new THREE.Vector2;
THREE.ExtrudeGeometry.__v5 = new THREE.Vector2;
THREE.ExtrudeGeometry.__v6 = new THREE.Vector2;
THREE.IcosahedronGeometry = function(a) {
    function b(a, b, c) {
        var d = Math.sqrt(a * a + b * b + c * c);
        return f.vertices.push(new THREE.Vertex(new THREE.Vector3(a / d, b / d, c / d))) - 1
    }
    function c(a, b, c, d) {
        var e = f.vertices[a].position,
            g = f.vertices[b].position,
            h = f.vertices[c].position,
            a = new THREE.Face3(a, b, c);
        a.vertexNormals.push(e.clone().normalize(), g.clone().normalize(), h.clone().normalize());
        d.faces.push(a);
        d.faceVertexUvs[0].push([new THREE.UV(1 - 0.5 * ((Math.atan2(e.z, e.x) + Math.PI) % Math.PI / Math.PI), 0.5 - e.y / 2), new THREE.UV(1 - 0.5 * ((Math.atan2(g.z, g.x) + Math.PI) % Math.PI / Math.PI), 0.5 - g.y / 2), new THREE.UV(1 - 0.5 * ((Math.atan2(h.z, h.x) + Math.PI) % Math.PI / Math.PI), 0.5 - h.y / 2)])
    }
    function d(a, c) {
        var d = f.vertices[a].position,
            e = f.vertices[c].position;
        return b((d.x + e.x) / 2, (d.y + e.y) / 2, (d.z + e.z) / 2)
    }
    var f = this,
        g = new THREE.Geometry;
    this.subdivisions = a || 0;
    THREE.Geometry.call(this);
    a = (1 + Math.sqrt(5)) / 2;
    b(-1, a, 0);
    b(1, a, 0);
    b(-1, -a, 0);
    b(1, -a, 0);
    b(0, -1, a);
    b(0, 1, a);
    b(0, -1, -a);
    b(0, 1, -a);
    b(a, 0, -1);
    b(a, 0, 1);
    b(-a, 0, -1);
    b(-a, 0, 1);
    c(0, 11, 5, g);
    c(0, 5, 1, g);
    c(0, 1, 7, g);
    c(0, 7, 10, g);
    c(0, 10, 11, g);
    c(1, 5, 9, g);
    c(5, 11, 4, g);
    c(11, 10, 2, g);
    c(10, 7, 6, g);
    c(7, 1, 8, g);
    c(3, 9, 4, g);
    c(3, 4, 2, g);
    c(3, 2, 6, g);
    c(3, 6, 8, g);
    c(3, 8, 9, g);
    c(4, 9, 5, g);
    c(2, 4, 11, g);
    c(6, 2, 10, g);
    c(8, 6, 7, g);
    c(9, 8, 1, g);
    for (var e = 0; e < this.subdivisions; e++) {
        for (var a = new THREE.Geometry, e = 0, h = g.faces.length; e < h; e++) {
            var i = g.faces[e],
                k = d(i.a, i.b),
                j = d(i.b, i.c),
                m = d(i.c, i.a);
            c(i.a, k, m, a);
            c(i.b, j, k, a);
            c(i.c, m, j, a);
            c(k, j, m, a)
        }
        g.faces = a.faces;
        g.faceVertexUvs[0] = a.faceVertexUvs[0]
    }
    f.faces = g.faces;
    f.faceVertexUvs[0] = g.faceVertexUvs[0];
    this.mergeVertices();
    this.computeCentroids();
    this.computeFaceNormals()
};
THREE.IcosahedronGeometry.prototype = new THREE.Geometry;
THREE.IcosahedronGeometry.prototype.constructor = THREE.IcosahedronGeometry;
THREE.LatheGeometry = function(a, b, c) {
    THREE.Geometry.call(this);
    this.steps = b || 12;
    this.angle = c || 2 * Math.PI;
    for (var b = this.angle / this.steps, c = [], d = [], f = [], g = [], e = (new THREE.Matrix4).setRotationZ(b), h = 0; h < a.length; h++) this.vertices.push(new THREE.Vertex(a[h])), c[h] = a[h].clone(), d[h] = this.vertices.length - 1;
    for (var i = 0; i <= this.angle + 0.001; i += b) {
        for (h = 0; h < c.length; h++) i < this.angle ? (c[h] = e.multiplyVector3(c[h].clone()), this.vertices.push(new THREE.Vertex(c[h])), f[h] = this.vertices.length - 1) : f = g;
        0 == i && (g = d);
        for (h = 0; h < d.length - 1; h++) this.faces.push(new THREE.Face4(f[h], f[h + 1], d[h + 1], d[h])), this.faceVertexUvs[0].push([new THREE.UV(1 - i / this.angle, h / a.length), new THREE.UV(1 - i / this.angle, (h + 1) / a.length), new THREE.UV(1 - (i - b) / this.angle, (h + 1) / a.length), new THREE.UV(1 - (i - b) / this.angle, h / a.length)]);
        d = f;
        f = []
    }
    this.computeCentroids();
    this.computeFaceNormals();
    this.computeVertexNormals()
};
THREE.LatheGeometry.prototype = new THREE.Geometry;
THREE.LatheGeometry.prototype.constructor = THREE.LatheGeometry;
THREE.OctahedronGeometry = function(a, b) {
    function c(b) {
        var c = b.clone().normalize(),
            c = new THREE.Vertex(c.clone().multiplyScalar(a));
        c.index = e.vertices.push(c) - 1;
        var d = Math.atan2(b.z, -b.x) / 2 / Math.PI + 0.5,
            b = Math.atan2(-b.y, Math.sqrt(b.x * b.x + b.z * b.z)) / Math.PI + 0.5;
        c.uv = new THREE.UV(d, b);
        return c
    }
    function d(a, b, c, h) {
        1 > h ? (h = new THREE.Face3(a.index, b.index, c.index, [a.position, b.position, c.position]), h.centroid.addSelf(a.position).addSelf(b.position).addSelf(c.position).divideScalar(3), h.normal = h.centroid.clone().normalize(), e.faces.push(h), h = Math.atan2(h.centroid.z, -h.centroid.x), e.faceVertexUvs[0].push([g(a.uv, a.position, h), g(b.uv, b.position, h), g(c.uv, c.position, h)])) : (h -= 1, d(a, f(a, b), f(a, c), h), d(f(a, b), b, f(b, c), h), d(f(a, c), f(b, c), c, h), d(f(a, b), f(b, c), f(a, c), h))
    }
    function f(a, b) {
        h[a.index] || (h[a.index] = []);
        h[b.index] || (h[b.index] = []);
        var d = h[a.index][b.index];
        void 0 === d && (h[a.index][b.index] = h[b.index][a.index] = d = c((new THREE.Vector3).add(a.position, b.position).divideScalar(2)));
        return d
    }
    function g(a, b, c) {
        0 > c && 1 === a.u && (a = new THREE.UV(a.u - 1, a.v));
        0 === b.x && 0 === b.z && (a = new THREE.UV(c / 2 / Math.PI + 0.5, a.v));
        return a
    }
    THREE.Geometry.call(this);
    var b = b || 0,
        e = this;
    c(new THREE.Vector3(1, 0, 0));
    c(new THREE.Vector3(-1, 0, 0));
    c(new THREE.Vector3(0, 1, 0));
    c(new THREE.Vector3(0, -1, 0));
    c(new THREE.Vector3(0, 0, 1));
    c(new THREE.Vector3(0, 0, -1));
    var h = [],
        i = this.vertices;
    d(i[0], i[2], i[4], b);
    d(i[0], i[4], i[3], b);
    d(i[0], i[3], i[5], b);
    d(i[0], i[5], i[2], b);
    d(i[1], i[2], i[5], b);
    d(i[1], i[5], i[3], b);
    d(i[1], i[3], i[4], b);
    d(i[1], i[4], i[2], b);
    this.boundingSphere = {
        radius: a
    }
};
THREE.OctahedronGeometry.prototype = new THREE.Geometry;
THREE.OctahedronGeometry.prototype.constructor = THREE.OctahedronGeometry;
THREE.PlaneGeometry = function(a, b, c, d) {
    THREE.Geometry.call(this);
    for (var f = a / 2, g = b / 2, c = c || 1, d = d || 1, e = c + 1, h = d + 1, i = a / c, k = b / d, j = new THREE.Vector3(0, 0, 1), a = 0; a < h; a++) for (b = 0; b < e; b++) this.vertices.push(new THREE.Vertex(new THREE.Vector3(b * i - f, -(a * k - g), 0)));
    for (a = 0; a < d; a++) for (b = 0; b < c; b++) f = new THREE.Face4(b + e * a, b + e * (a + 1), b + 1 + e * (a + 1), b + 1 + e * a), f.normal.copy(j), f.vertexNormals.push(j.clone(), j.clone(), j.clone(), j.clone()), this.faces.push(f), this.faceVertexUvs[0].push([new THREE.UV(b / c, a / d), new THREE.UV(b / c, (a + 1) / d), new THREE.UV((b + 1) / c, (a + 1) / d), new THREE.UV((b + 1) / c, a / d)]);
    this.computeCentroids()
};
THREE.PlaneGeometry.prototype = new THREE.Geometry;
THREE.PlaneGeometry.prototype.constructor = THREE.PlaneGeometry;
THREE.SphereGeometry = function(a, b, c, d, f, g, e) {
    THREE.Geometry.call(this);
    var a = a || 50,
        d = void 0 !== d ? d : 0,
        f = void 0 !== f ? f : 2 * Math.PI,
        g = void 0 !== g ? g : 0,
        e = void 0 !== e ? e : Math.PI,
        b = Math.max(3, Math.floor(b) || 8),
        c = Math.max(2, Math.floor(c) || 6),
        h, i, k = [],
        j = [];
    for (i = 0; i <= c; i++) {
        var m = [],
            p = [];
        for (h = 0; h <= b; h++) {
            var n = h / b,
                l = i / c,
                o = -a * Math.cos(d + n * f) * Math.sin(g + l * e),
                q = a * Math.cos(g + l * e),
                r = a * Math.sin(d + n * f) * Math.sin(g + l * e);
            this.vertices.push(new THREE.Vertex(new THREE.Vector3(o, q, r)));
            m.push(this.vertices.length - 1);
            p.push(new THREE.UV(n, l))
        }
        k.push(m);
        j.push(p)
    }
    for (i = 0; i < c; i++) for (h = 0; h < b; h++) {
        var d = k[i][h + 1],
            f = k[i][h],
            g = k[i + 1][h],
            e = k[i + 1][h + 1],
            m = this.vertices[d].position.clone().normalize(),
            p = this.vertices[f].position.clone().normalize(),
            n = this.vertices[g].position.clone().normalize(),
            l = this.vertices[e].position.clone().normalize(),
            o = j[i][h + 1].clone(),
            q = j[i][h].clone(),
            r = j[i + 1][h].clone(),
            s = j[i + 1][h + 1].clone();
        Math.abs(this.vertices[d].position.y) == a ? (this.faces.push(new THREE.Face3(d, g, e, [m, n, l])), this.faceVertexUvs[0].push([o, r, s])) : Math.abs(this.vertices[g].position.y) == a ? (this.faces.push(new THREE.Face3(d, f, g, [m, p, n])), this.faceVertexUvs[0].push([o, q, r])) : (this.faces.push(new THREE.Face4(d, f, g, e, [m, p, n, l])), this.faceVertexUvs[0].push([o, q, r, s]))
    }
    this.computeCentroids();
    this.computeFaceNormals();
    this.boundingSphere = {
        radius: a
    }
};
THREE.SphereGeometry.prototype = new THREE.Geometry;
THREE.SphereGeometry.prototype.constructor = THREE.SphereGeometry;
THREE.TextGeometry = function(a, b) {
    var c = (new THREE.TextPath(a, b)).toShapes();
    b.amount = void 0 !== b.height ? b.height : 50;
    if (void 0 === b.bevelThickness) b.bevelThickness = 10;
    if (void 0 === b.bevelSize) b.bevelSize = 8;
    if (void 0 === b.bevelEnabled) b.bevelEnabled = !1;
    if (b.bend) {
        var d = c[c.length - 1].getBoundingBox().maxX;
        b.bendPath = new THREE.QuadraticBezierCurve(new THREE.Vector2(0, 0), new THREE.Vector2(d / 2, 120), new THREE.Vector2(d, 0))
    }
    THREE.ExtrudeGeometry.call(this, c, b)
};
THREE.TextGeometry.prototype = new THREE.ExtrudeGeometry;
THREE.TextGeometry.prototype.constructor = THREE.TextGeometry;
THREE.FontUtils = {
    faces: {},
    face: "helvetiker",
    weight: "normal",
    style: "normal",
    size: 150,
    divisions: 10,
    getFace: function() {
        return this.faces[this.face][this.weight][this.style]
    },
    loadFace: function(a) {
        var b = a.familyName.toLowerCase();
        this.faces[b] = this.faces[b] || {};
        this.faces[b][a.cssFontWeight] = this.faces[b][a.cssFontWeight] || {};
        this.faces[b][a.cssFontWeight][a.cssFontStyle] = a;
        return this.faces[b][a.cssFontWeight][a.cssFontStyle] = a
    },
    drawText: function(a) {
        for (var b = this.getFace(), c = this.size / b.resolution, d = 0, f = ("" + a).split(""), g = f.length, e = [], a = 0; a < g; a++) {
            var h = new THREE.Path,
                h = this.extractGlyphPoints(f[a], b, c, d, h),
                d = d + h.offset;
            e.push(h.path)
        }
        return {
            paths: e,
            offset: d / 2
        }
    },
    extractGlyphPoints: function(a, b, c, d, f) {
        var g = [],
            e, h, i, k, j, m, p, n, l, o, q, r = b.glyphs[a] || b.glyphs["?"];
        if (r) {
            if (r.o) {
                b = r._cachedOutline || (r._cachedOutline = r.o.split(" "));
                k = b.length;
                for (a = 0; a < k;) switch (i = b[a++], i) {
                case "m":
                    i = b[a++] * c + d;
                    j = b[a++] * c;
                    g.push(new THREE.Vector2(i, j));
                    f.moveTo(i, j);
                    break;
                case "l":
                    i = b[a++] * c + d;
                    j = b[a++] * c;
                    g.push(new THREE.Vector2(i, j));
                    f.lineTo(i, j);
                    break;
                case "q":
                    i = b[a++] * c + d;
                    j = b[a++] * c;
                    n = b[a++] * c + d;
                    l = b[a++] * c;
                    f.quadraticCurveTo(n, l, i, j);
                    if (e = g[g.length - 1]) {
                        m = e.x;
                        p = e.y;
                        for (e = 1, h = this.divisions; e <= h; e++) {
                            var s = e / h,
                                t = THREE.Shape.Utils.b2(s, m, n, i),
                                s = THREE.Shape.Utils.b2(s, p, l, j);
                            g.push(new THREE.Vector2(t, s))
                        }
                    }
                    break;
                case "b":
                    if (i = b[a++] * c + d, j = b[a++] * c, n = b[a++] * c + d, l = b[a++] * -c, o = b[a++] * c + d, q = b[a++] * -c, f.bezierCurveTo(i, j, n, l, o, q), e = g[g.length - 1]) {
                        m = e.x;
                        p = e.y;
                        for (e = 1, h = this.divisions; e <= h; e++) s = e / h, t = THREE.Shape.Utils.b3(s, m, n, o, i), s = THREE.Shape.Utils.b3(s, p, l, q, j), g.push(new THREE.Vector2(t, s))
                    }
                }
            }
            return {
                offset: r.ha * c,
                points: g,
                path: f
            }
        }
    }
};
(function(a) {
    var b = function(a) {
            for (var b = a.length, f = 0, g = b - 1, e = 0; e < b; g = e++) f += a[g].x * a[e].y - a[e].x * a[g].y;
            return 0.5 * f
        };
    a.Triangulate = function(a, d) {
        var f = a.length;
        if (3 > f) return null;
        var g = [],
            e = [],
            h = [],
            i, k, j;
        if (0 < b(a)) for (k = 0; k < f; k++) e[k] = k;
        else for (k = 0; k < f; k++) e[k] = f - 1 - k;
        var m = 2 * f;
        for (k = f - 1; 2 < f;) {
            if (0 >= m--) {
                console.log("Warning, unable to triangulate polygon!");
                break
            }
            i = k;
            f <= i && (i = 0);
            k = i + 1;
            f <= k && (k = 0);
            j = k + 1;
            f <= j && (j = 0);
            var p;
            a: {
                p = a;
                var n = i,
                    l = k,
                    o = j,
                    q = f,
                    r = e,
                    s = void 0,
                    t = void 0,
                    v = void 0,
                    u = void 0,
                    w = void 0,
                    z = void 0,
                    x = void 0,
                    A = void 0,
                    F = void 0,
                    t = p[r[n]].x,
                    v = p[r[n]].y,
                    u = p[r[l]].x,
                    w = p[r[l]].y,
                    z = p[r[o]].x,
                    x = p[r[o]].y;
                if (1.0E-10 > (u - t) * (x - v) - (w - v) * (z - t)) p = !1;
                else {
                    for (s = 0; s < q; s++) if (!(s == n || s == l || s == o)) {
                        var A = p[r[s]].x,
                            F = p[r[s]].y,
                            E = void 0,
                            I = void 0,
                            J = void 0,
                            B = void 0,
                            G = void 0,
                            D = void 0,
                            H = void 0,
                            y = void 0,
                            K = void 0,
                            C = void 0,
                            L = void 0,
                            N = void 0,
                            E = J = G = void 0,
                            E = z - u,
                            I = x - w,
                            J = t - z,
                            B = v - x,
                            G = u - t,
                            D = w - v,
                            H = A - t,
                            y = F - v,
                            K = A - u,
                            C = F - w,
                            L = A - z,
                            N = F - x,
                            E = E * C - I * K,
                            G = G * y - D * H,
                            J = J * N - B * L;
                        if (0 <= E && 0 <= J && 0 <= G) {
                            p = !1;
                            break a
                        }
                    }
                    p = !0
                }
            }
            if (p) {
                g.push([a[e[i]], a[e[k]], a[e[j]]]);
                h.push([e[i], e[k], e[j]]);
                for (i = k, j = k + 1; j < f; i++, j++) e[i] = e[j];
                f--;
                m = 2 * f
            }
        }
        return d ? h : g
    };
    a.Triangulate.area = b;
    return a
})(THREE.FontUtils);
self._typeface_js = {
    faces: THREE.FontUtils.faces,
    loadFace: THREE.FontUtils.loadFace
};
THREE.TorusGeometry = function(a, b, c, d, f) {
    THREE.Geometry.call(this);
    this.radius = a || 100;
    this.tube = b || 40;
    this.segmentsR = c || 8;
    this.segmentsT = d || 6;
    this.arc = f || 2 * Math.PI;
    f = new THREE.Vector3;
    a = [];
    b = [];
    for (c = 0; c <= this.segmentsR; c++) for (d = 0; d <= this.segmentsT; d++) {
        var g = d / this.segmentsT * this.arc,
            e = 2 * c / this.segmentsR * Math.PI;
        f.x = this.radius * Math.cos(g);
        f.y = this.radius * Math.sin(g);
        var h = new THREE.Vector3;
        h.x = (this.radius + this.tube * Math.cos(e)) * Math.cos(g);
        h.y = (this.radius + this.tube * Math.cos(e)) * Math.sin(g);
        h.z = this.tube * Math.sin(e);
        this.vertices.push(new THREE.Vertex(h));
        a.push(new THREE.UV(d / this.segmentsT, 1 - c / this.segmentsR));
        b.push(h.clone().subSelf(f).normalize())
    }
    for (c = 1; c <= this.segmentsR; c++) for (d = 1; d <= this.segmentsT; d++) {
        var f = (this.segmentsT + 1) * c + d - 1,
            g = (this.segmentsT + 1) * (c - 1) + d - 1,
            e = (this.segmentsT + 1) * (c - 1) + d,
            h = (this.segmentsT + 1) * c + d,
            i = new THREE.Face4(f, g, e, h, [b[f], b[g], b[e], b[h]]);
        i.normal.addSelf(b[f]);
        i.normal.addSelf(b[g]);
        i.normal.addSelf(b[e]);
        i.normal.addSelf(b[h]);
        i.normal.normalize();
        this.faces.push(i);
        this.faceVertexUvs[0].push([a[f].clone(), a[g].clone(), a[e].clone(), a[h].clone()])
    }
    this.computeCentroids()
};
THREE.TorusGeometry.prototype = new THREE.Geometry;
THREE.TorusGeometry.prototype.constructor = THREE.TorusGeometry;
THREE.TorusKnotGeometry = function(a, b, c, d, f, g, e) {
    function h(a, b, c, d, e, f) {
        var g = Math.cos(a);
        Math.cos(b);
        b = Math.sin(a);
        a *= c / d;
        c = Math.cos(a);
        g *= 0.5 * e * (2 + c);
        b = 0.5 * e * (2 + c) * b;
        e = 0.5 * f * e * Math.sin(a);
        return new THREE.Vector3(g, b, e)
    }
    THREE.Geometry.call(this);
    this.radius = a || 200;
    this.tube = b || 40;
    this.segmentsR = c || 64;
    this.segmentsT = d || 8;
    this.p = f || 2;
    this.q = g || 3;
    this.heightScale = e || 1;
    this.grid = Array(this.segmentsR);
    c = new THREE.Vector3;
    d = new THREE.Vector3;
    f = new THREE.Vector3;
    for (a = 0; a < this.segmentsR; ++a) {
        this.grid[a] = Array(this.segmentsT);
        for (b = 0; b < this.segmentsT; ++b) {
            var i = 2 * (a / this.segmentsR) * this.p * Math.PI,
                e = 2 * (b / this.segmentsT) * Math.PI,
                g = h(i, e, this.q, this.p, this.radius, this.heightScale),
                i = h(i + 0.01, e, this.q, this.p, this.radius, this.heightScale);
            c.sub(i, g);
            d.add(i, g);
            f.cross(c, d);
            d.cross(f, c);
            f.normalize();
            d.normalize();
            i = -this.tube * Math.cos(e);
            e = this.tube * Math.sin(e);
            g.x += i * d.x + e * f.x;
            g.y += i * d.y + e * f.y;
            g.z += i * d.z + e * f.z;
            this.grid[a][b] = this.vertices.push(new THREE.Vertex(new THREE.Vector3(g.x, g.y, g.z))) - 1
        }
    }
    for (a = 0; a < this.segmentsR; ++a) for (b = 0; b < this.segmentsT; ++b) {
        var f = (a + 1) % this.segmentsR,
            g = (b + 1) % this.segmentsT,
            c = this.grid[a][b],
            d = this.grid[f][b],
            f = this.grid[f][g],
            g = this.grid[a][g],
            e = new THREE.UV(a / this.segmentsR, b / this.segmentsT),
            i = new THREE.UV((a + 1) / this.segmentsR, b / this.segmentsT),
            k = new THREE.UV((a + 1) / this.segmentsR, (b + 1) / this.segmentsT),
            j = new THREE.UV(a / this.segmentsR, (b + 1) / this.segmentsT);
        this.faces.push(new THREE.Face4(c, d, f, g));
        this.faceVertexUvs[0].push([e, i, k, j])
    }
    this.computeCentroids();
    this.computeFaceNormals();
    this.computeVertexNormals()
};
THREE.TorusKnotGeometry.prototype = new THREE.Geometry;
THREE.TorusKnotGeometry.prototype.constructor = THREE.TorusKnotGeometry;
THREE.AxisHelper = function() {
    THREE.Object3D.call(this);
    var a = new THREE.Geometry;
    a.vertices.push(new THREE.Vertex);
    a.vertices.push(new THREE.Vertex(new THREE.Vector3(0, 100, 0)));
    var b = new THREE.CylinderGeometry(0, 5, 25, 5, 1),
        c;
    c = new THREE.Line(a, new THREE.LineBasicMaterial({
        color: 16711680
    }));
    c.rotation.z = -Math.PI / 2;
    this.add(c);
    c = new THREE.Mesh(b, new THREE.MeshBasicMaterial({
        color: 16711680
    }));
    c.position.x = 100;
    c.rotation.z = -Math.PI / 2;
    this.add(c);
    c = new THREE.Line(a, new THREE.LineBasicMaterial({
        color: 65280
    }));
    this.add(c);
    c = new THREE.Mesh(b, new THREE.MeshBasicMaterial({
        color: 65280
    }));
    c.position.y = 100;
    this.add(c);
    c = new THREE.Line(a, new THREE.LineBasicMaterial({
        color: 255
    }));
    c.rotation.x = Math.PI / 2;
    this.add(c);
    c = new THREE.Mesh(b, new THREE.MeshBasicMaterial({
        color: 255
    }));
    c.position.z = 100;
    c.rotation.x = Math.PI / 2;
    this.add(c)
};
THREE.AxisHelper.prototype = new THREE.Object3D;
THREE.AxisHelper.prototype.constructor = THREE.AxisHelper;
THREE.CameraHelper = function(a) {
    function b(a, b, d) {
        c(a, d);
        c(b, d)
    }
    function c(a, b) {
        d.lineGeometry.vertices.push(new THREE.Vertex(new THREE.Vector3));
        d.lineGeometry.colors.push(new THREE.Color(b));
        void 0 === d.pointMap[a] && (d.pointMap[a] = []);
        d.pointMap[a].push(d.lineGeometry.vertices.length - 1)
    }
    THREE.Object3D.call(this);
    var d = this;
    this.lineGeometry = new THREE.Geometry;
    this.lineMaterial = new THREE.LineBasicMaterial({
        color: 16777215,
        vertexColors: THREE.FaceColors
    });
    this.pointMap = {};
    b("n1", "n2", 16755200);
    b("n2", "n4", 16755200);
    b("n4", "n3", 16755200);
    b("n3", "n1", 16755200);
    b("f1", "f2", 16755200);
    b("f2", "f4", 16755200);
    b("f4", "f3", 16755200);
    b("f3", "f1", 16755200);
    b("n1", "f1", 16755200);
    b("n2", "f2", 16755200);
    b("n3", "f3", 16755200);
    b("n4", "f4", 16755200);
    b("p", "n1", 16711680);
    b("p", "n2", 16711680);
    b("p", "n3", 16711680);
    b("p", "n4", 16711680);
    b("u1", "u2", 43775);
    b("u2", "u3", 43775);
    b("u3", "u1", 43775);
    b("c", "t", 16777215);
    b("p", "c", 3355443);
    b("cn1", "cn2", 3355443);
    b("cn3", "cn4", 3355443);
    b("cf1", "cf2", 3355443);
    b("cf3", "cf4", 3355443);
    this.update(a);
    this.lines = new THREE.Line(this.lineGeometry, this.lineMaterial, THREE.LinePieces);
    this.add(this.lines)
};
THREE.CameraHelper.prototype = new THREE.Object3D;
THREE.CameraHelper.prototype.constructor = THREE.CameraHelper;
THREE.CameraHelper.prototype.update = function(a) {
    function b(a, b, g, e) {
        THREE.CameraHelper.__v.set(b, g, e);
        THREE.CameraHelper.__projector.unprojectVector(THREE.CameraHelper.__v, THREE.CameraHelper.__c);
        a = c.pointMap[a];
        if (void 0 !== a) {
            b = 0;
            for (g = a.length; b < g; b++) c.lineGeometry.vertices[a[b]].position.copy(THREE.CameraHelper.__v)
        }
    }
    var c = this;
    THREE.CameraHelper.__c.projectionMatrix.copy(a.projectionMatrix);
    b("c", 0, 0, -1);
    b("t", 0, 0, 1);
    b("n1", -1, -1, -1);
    b("n2", 1, -1, -1);
    b("n3", -1, 1, -1);
    b("n4", 1, 1, -1);
    b("f1", -1, -1, 1);
    b("f2", 1, -1, 1);
    b("f3", -1, 1, 1);
    b("f4", 1, 1, 1);
    b("u1", 0.7, 1.1, -1);
    b("u2", -0.7, 1.1, -1);
    b("u3", 0, 2, -1);
    b("cf1", -1, 0, 1);
    b("cf2", 1, 0, 1);
    b("cf3", 0, -1, 1);
    b("cf4", 0, 1, 1);
    b("cn1", -1, 0, -1);
    b("cn2", 1, 0, -1);
    b("cn3", 0, -1, -1);
    b("cn4", 0, 1, -1);
    this.lineGeometry.__dirtyVertices = !0
};
THREE.CameraHelper.__projector = new THREE.Projector;
THREE.CameraHelper.__v = new THREE.Vector3;
THREE.CameraHelper.__c = new THREE.Camera;
THREE.SubdivisionModifier = function(a) {
    this.subdivisions = void 0 === a ? 1 : a;
    this.useOldVertexColors = !1;
    this.supportUVs = !0
};
THREE.SubdivisionModifier.prototype.constructor = THREE.SubdivisionModifier;
THREE.SubdivisionModifier.prototype.modify = function(a) {
    for (var b = this.subdivisions; 0 < b--;) this.smooth(a)
};
THREE.SubdivisionModifier.prototype.smooth = function(a) {
    function b(a, b, c, d, h, i) {
        var k = new THREE.Face4(a, b, c, d, null, h.color, h.material);
        if (e.useOldVertexColors) {
            k.vertexColors = [];
            for (var j, m, l, o = 0; 4 > o; o++) {
                l = i[o];
                j = new THREE.Color;
                j.setRGB(0, 0, 0);
                for (var n = 0; n < l.length; n++) m = h.vertexColors[l[n] - 1], j.r += m.r, j.g += m.g, j.b += m.b;
                j.r /= l.length;
                j.g /= l.length;
                j.b /= l.length;
                k.vertexColors[o] = j
            }
        }
        f.push(k);
        (!e.supportUVs || 0 != p.length) && g.push([p[a], p[b], p[c], p[d]])
    }
    function c(a, b) {
        return Math.min(a, b) + "_" + Math.max(a, b)
    }
    var d = [],
        f = [],
        g = [],
        e = this,
        h = a.vertices,
        d = a.faces,
        i = h.concat(),
        k = [],
        j = {},
        m = {},
        p = [],
        n, l, o, q, r, s = a.faceVertexUvs[0];
    for (n = 0, l = s.length; n < l; n++) for (o = 0, q = s[n].length; o < q; o++) r = d[n]["abcd".charAt(o)], p[r] || (p[r] = s[n][o]);
    var t;
    for (n = 0, l = d.length; n < l; n++) if (r = d[n], k.push(r.centroid), i.push(new THREE.Vertex(r.centroid)), e.supportUVs && 0 != p.length) {
        t = new THREE.UV;
        if (r instanceof THREE.Face3) t.u = p[r.a].u + p[r.b].u + p[r.c].u, t.v = p[r.a].v + p[r.b].v + p[r.c].v, t.u /= 3, t.v /= 3;
        else if (r instanceof THREE.Face4) t.u = p[r.a].u + p[r.b].u + p[r.c].u + p[r.d].u, t.v = p[r.a].v + p[r.b].v + p[r.c].v + p[r.d].v, t.u /= 4, t.v /= 4;
        p.push(t)
    }
    l = function(a) {
        function b(a, c, d) {
            void 0 === a[c] && (a[c] = []);
            a[c].push(d)
        }
        var d, e, g, f, h = {};
        for (d = 0, e = a.faces.length; d < e; d++) g = a.faces[d], g instanceof THREE.Face3 ? (f = c(g.a, g.b), b(h, f, d), f = c(g.b, g.c), b(h, f, d), f = c(g.c, g.a), b(h, f, d)) : g instanceof THREE.Face4 && (f = c(g.a, g.b), b(h, f, d), f = c(g.b, g.c), b(h, f, d), f = c(g.c, g.d), b(h, f, d), f = c(g.d, g.a), b(h, f, d));
        return h
    }(a);
    var v = 0,
        s = h.length,
        u, w, z = {},
        x = {},
        A = function(a, b) {
            void 0 === z[a] && (z[a] = []);
            z[a].push(b)
        },
        F = function(a, b) {
            void 0 === x[a] && (x[a] = {});
            x[a][b] = null
        };
    for (n in l) {
        t = l[n];
        u = n.split("_");
        w = u[0];
        u = u[1];
        A(w, [w, u]);
        A(u, [w, u]);
        for (o = 0, q = t.length; o < q; o++) r = t[o], F(w, r, n), F(u, r, n);
        2 > t.length && (m[n] = !0)
    }
    for (n in l) if (t = l[n], r = t[0], t = t[1], u = n.split("_"), w = u[0], u = u[1], q = new THREE.Vector3, m[n] ? (q.addSelf(h[w].position), q.addSelf(h[u].position), q.multiplyScalar(0.5)) : (q.addSelf(k[r]), q.addSelf(k[t]), q.addSelf(h[w].position), q.addSelf(h[u].position), q.multiplyScalar(0.25)), j[n] = s + d.length + v, i.push(new THREE.Vertex(q)), v++, e.supportUVs && 0 != p.length) t = new THREE.UV, t.u = p[w].u + p[u].u, t.v = p[w].v + p[u].v, t.u /= 2, t.v /= 2, p.push(t);
    var E, I;
    u = ["123", "12", "2", "23"];
    q = ["123", "23", "3", "31"];
    var A = ["123", "31", "1", "12"],
        F = ["1234", "12", "2", "23"],
        J = ["1234", "23", "3", "34"],
        B = ["1234", "34", "4", "41"],
        G = ["1234", "41", "1", "12"];
    for (n = 0, l = k.length; n < l; n++) r = d[n], t = s + n, r instanceof THREE.Face3 ? (v = c(r.a, r.b), w = c(r.b, r.c), E = c(r.c, r.a), b(t, j[v], r.b, j[w], r, u), b(t, j[w], r.c, j[E], r, q), b(t, j[E], r.a, j[v], r, A)) : r instanceof THREE.Face4 ? (v = c(r.a, r.b), w = c(r.b, r.c), E = c(r.c, r.d), I = c(r.d, r.a), b(t, j[v], r.b, j[w], r, F), b(t, j[w], r.c, j[E], r, J), b(t, j[E], r.d, j[I], r, B), b(t, j[I], r.a, j[v], r, G)) : console.log("face should be a face!", r);
    d = i;
    i = new THREE.Vector3;
    j = new THREE.Vector3;
    for (n = 0, l = h.length; n < l; n++) if (void 0 !== z[n]) {
        i.set(0, 0, 0);
        j.set(0, 0, 0);
        r = new THREE.Vector3(0, 0, 0);
        t = 0;
        for (o in x[n]) i.addSelf(k[o]), t++;
        v = 0;
        s = z[n].length;
        for (o = 0; o < s; o++) m[c(z[n][o][0], z[n][o][1])] && v++;
        if (2 != v) {
            i.divideScalar(t);
            for (o = 0; o < s; o++) t = z[n][o], t = h[t[0]].position.clone().addSelf(h[t[1]].position).divideScalar(2), j.addSelf(t);
            j.divideScalar(s);
            r.addSelf(h[n].position);
            r.multiplyScalar(s - 3);
            r.addSelf(i);
            r.addSelf(j.multiplyScalar(2));
            r.divideScalar(s);
            d[n].position = r
        }
    }
    a.vertices = d;
    a.faces = f;
    a.faceVertexUvs[0] = g;
    delete a.__tmpVertices;
    a.computeCentroids();
    a.computeFaceNormals();
    a.computeVertexNormals()
};
THREE.Loader = function(a) {
    this.statusDomElement = (this.showStatus = a) ? THREE.Loader.prototype.addStatusElement() : null;
    this.onLoadStart = function() {};
    this.onLoadProgress = function() {};
    this.onLoadComplete = function() {}
};
THREE.Loader.prototype = {
    constructor: THREE.Loader,
    crossOrigin: "",
    addStatusElement: function() {
        var a = document.createElement("div");
        a.style.position = "absolute";
        a.style.right = "0px";
        a.style.top = "0px";
        a.style.fontSize = "0.8em";
        a.style.textAlign = "left";
        a.style.background = "rgba(0,0,0,0.25)";
        a.style.color = "#fff";
        a.style.width = "120px";
        a.style.padding = "0.5em 0.5em 0.5em 0.5em";
        a.style.zIndex = 1E3;
        a.innerHTML = "Loading ...";
        return a
    },
    updateProgress: function(a) {
        var b = "Loaded ",
            b = a.total ? b + ((100 * a.loaded / a.total).toFixed(0) + "%") : b + ((a.loaded / 1E3).toFixed(2) + " KB");
        this.statusDomElement.innerHTML = b
    },
    extractUrlbase: function(a) {
        a = a.split("/");
        a.pop();
        return 1 > a.length ? "" : a.join("/") + "/"
    },
    initMaterials: function(a, b, c) {
        a.materials = [];
        for (var d = 0; d < b.length; ++d) a.materials[d] = THREE.Loader.prototype.createMaterial(b[d], c)
    },
    hasNormals: function(a) {
        var b, c, d = a.materials.length;
        for (c = 0; c < d; c++) if (b = a.materials[c], b instanceof THREE.ShaderMaterial) return !0;
        return !1
    },
    createMaterial: function(a, b) {
        function c(a) {
            a = Math.log(a) / Math.LN2;
            return Math.floor(a) == a
        }
        function d(a) {
            a = Math.log(a) / Math.LN2;
            return Math.pow(2, Math.round(a))
        }
        function f(a, b) {
            var e = new Image;
            e.onload = function() {
                if (!c(this.width) || !c(this.height)) {
                    var b = d(this.width),
                        e = d(this.height);
                    a.image.width = b;
                    a.image.height = e;
                    a.image.getContext("2d").drawImage(this, 0, 0, b, e)
                } else a.image = this;
                a.needsUpdate = !0
            };
            e.crossOrigin = h.crossOrigin;
            e.src = b
        }
        function g(a, c, d, e, g, h) {
            var i = document.createElement("canvas");
            a[c] = new THREE.Texture(i);
            a[c].sourceFile = d;
            if (e) {
                a[c].repeat.set(e[0], e[1]);
                if (1 != e[0]) a[c].wrapS = THREE.RepeatWrapping;
                if (1 != e[1]) a[c].wrapT = THREE.RepeatWrapping
            }
            g && a[c].offset.set(g[0], g[1]);
            if (h) {
                e = {
                    repeat: THREE.RepeatWrapping,
                    mirror: THREE.MirroredRepeatWrapping
                };
                if (void 0 !== e[h[0]]) a[c].wrapS = e[h[0]];
                if (void 0 !== e[h[1]]) a[c].wrapT = e[h[1]]
            }
            f(a[c], b + "/" + d)
        }
        function e(a) {
            return (255 * a[0] << 16) + (255 * a[1] << 8) + 255 * a[2]
        }
        var h = this,
            i = "MeshLambertMaterial",
            k = {
                color: 15658734,
                opacity: 1,
                map: null,
                lightMap: null,
                normalMap: null,
                wireframe: a.wireframe
            };
        a.shading && ("Phong" == a.shading ? i = "MeshPhongMaterial" : "Basic" == a.shading && (i = "MeshBasicMaterial"));
        if (a.blending) if ("Additive" == a.blending) k.blending = THREE.AdditiveBlending;
        else if ("Subtractive" == a.blending) k.blending = THREE.SubtractiveBlending;
        else if ("Multiply" == a.blending) k.blending = THREE.MultiplyBlending;
        if (void 0 !== a.transparent || 1 > a.opacity) k.transparent = a.transparent;
        if (void 0 !== a.depthTest) k.depthTest = a.depthTest;
        if (void 0 !== a.vertexColors) if ("face" == a.vertexColors) k.vertexColors = THREE.FaceColors;
        else if (a.vertexColors) k.vertexColors = THREE.VertexColors;
        if (a.colorDiffuse) k.color = e(a.colorDiffuse);
        else if (a.DbgColor) k.color = a.DbgColor;
        if (a.colorSpecular) k.specular = e(a.colorSpecular);
        if (a.colorAmbient) k.ambient = e(a.colorAmbient);
        if (a.transparency) k.opacity = a.transparency;
        if (a.specularCoef) k.shininess = a.specularCoef;
        a.mapDiffuse && b && g(k, "map", a.mapDiffuse, a.mapDiffuseRepeat, a.mapDiffuseOffset, a.mapDiffuseWrap);
        a.mapLight && b && g(k, "lightMap", a.mapLight, a.mapLightRepeat, a.mapLightOffset, a.mapLightWrap);
        a.mapNormal && b && g(k, "normalMap", a.mapNormal, a.mapNormalRepeat, a.mapNormalOffset, a.mapNormalWrap);
        a.mapSpecular && b && g(k, "specularMap", a.mapSpecular, a.mapSpecularRepeat, a.mapSpecularOffset, a.mapSpecularWrap);
        if (a.mapNormal) {
            var i = THREE.ShaderUtils.lib.normal,
                j = THREE.UniformsUtils.clone(i.uniforms);
            j.tNormal.texture = k.normalMap;
            if (a.mapNormalFactor) j.uNormalScale.value = a.mapNormalFactor;
            if (k.map) j.tDiffuse.texture = k.map, j.enableDiffuse.value = !0;
            if (k.specularMap) j.tSpecular.texture = k.specularMap, j.enableSpecular.value = !0;
            if (k.lightMap) j.tAO.texture = k.lightMap, j.enableAO.value = !0;
            j.uDiffuseColor.value.setHex(k.color);
            j.uSpecularColor.value.setHex(k.specular);
            j.uAmbientColor.value.setHex(k.ambient);
            j.uShininess.value = k.shininess;
            if (void 0 !== k.opacity) j.uOpacity.value = k.opacity;
            k = new THREE.ShaderMaterial({
                fragmentShader: i.fragmentShader,
                vertexShader: i.vertexShader,
                uniforms: j,
                lights: !0,
                fog: !0
            })
        } else k = new THREE[i](k);
        if (void 0 !== a.DbgName) k.name = a.DbgName;
        return k
    }
};
THREE.BinaryLoader = function(a) {
    THREE.Loader.call(this, a)
};
THREE.BinaryLoader.prototype = new THREE.Loader;
THREE.BinaryLoader.prototype.constructor = THREE.BinaryLoader;
THREE.BinaryLoader.prototype.supr = THREE.Loader.prototype;
THREE.BinaryLoader.prototype.load = function(a, b, c, d) {
    if (a instanceof Object) console.warn("DEPRECATED: BinaryLoader( parameters ) is now BinaryLoader( url, callback, texturePath, binaryPath )."), d = a, a = d.model, b = d.callback, c = d.texture_path, d = d.bin_path;
    var c = c ? c : this.extractUrlbase(a),
        d = d ? d : this.extractUrlbase(a),
        f = this.showProgress ? THREE.Loader.prototype.updateProgress : null;
    this.onLoadStart();
    this.loadAjaxJSON(this, a, b, c, d, f)
};
THREE.BinaryLoader.prototype.loadAjaxJSON = function(a, b, c, d, f, g) {
    var e = new XMLHttpRequest;
    e.onreadystatechange = function() {
        if (4 == e.readyState) if (200 == e.status || 0 == e.status) try {
            var h = JSON.parse(e.responseText);
            void 0 === h.metadata || void 0 === h.metadata.formatVersion || 3 !== h.metadata.formatVersion ? console.error("Deprecated file format.") : a.loadAjaxBuffers(h, c, f, d, g)
        } catch (i) {
            console.error(i), console.warn("DEPRECATED: [" + b + "] seems to be using old model format")
        } else console.error("Couldn't load [" + b + "] [" + e.status + "]")
    };
    e.open("GET", b, !0);
    e.overrideMimeType && e.overrideMimeType("text/plain; charset=x-user-defined");
    e.setRequestHeader("Content-Type", "text/plain");
    e.send(null)
};
THREE.BinaryLoader.prototype.loadAjaxBuffers = function(a, b, c, d, f) {
    var g = new XMLHttpRequest,
        e = c + "/" + a.buffers,
        h = 0;
    g.onreadystatechange = function() {
        4 == g.readyState ? 200 == g.status || 0 == g.status ? THREE.BinaryLoader.prototype.createBinModel(g.response, b, d, a.materials) : console.error("Couldn't load [" + e + "] [" + g.status + "]") : 3 == g.readyState ? f && (0 == h && (h = g.getResponseHeader("Content-Length")), f({
            total: h,
            loaded: g.responseText.length
        })) : 2 == g.readyState && (h = g.getResponseHeader("Content-Length"))
    };
    g.open("GET", e, !0);
    g.responseType = "arraybuffer";
    g.send(null)
};
THREE.BinaryLoader.prototype.createBinModel = function(a, b, c, d) {
    var f = function(b) {
            var c, f, i, k, j, m, p, n, l, o, q, r, s, t, v, u;

            function w(a) {
                return a % 4 ? 4 - a % 4 : 0
            }
            function z(a, b) {
                return (new Uint8Array(a, b, 1))[0]
            }
            function x(a, b) {
                return (new Uint32Array(a, b, 1))[0]
            }
            function A(b, c) {
                var d, e, f, g, h, i, j, k, l = new Uint32Array(a, c, 3 * b);
                for (d = 0; d < b; d++) {
                    e = l[3 * d];
                    f = l[3 * d + 1];
                    g = l[3 * d + 2];
                    h = y[2 * e];
                    e = y[2 * e + 1];
                    i = y[2 * f];
                    j = y[2 * f + 1];
                    f = y[2 * g];
                    k = y[2 * g + 1];
                    g = G.faceVertexUvs[0];
                    var m = [];
                    m.push(new THREE.UV(h, e));
                    m.push(new THREE.UV(i, j));
                    m.push(new THREE.UV(f, k));
                    g.push(m)
                }
            }
            function F(b, c) {
                var d, e, f, g, h, i, j, k, l, m, o = new Uint32Array(a, c, 4 * b);
                for (d = 0; d < b; d++) {
                    e = o[4 * d];
                    f = o[4 * d + 1];
                    g = o[4 * d + 2];
                    h = o[4 * d + 3];
                    i = y[2 * e];
                    e = y[2 * e + 1];
                    j = y[2 * f];
                    l = y[2 * f + 1];
                    k = y[2 * g];
                    m = y[2 * g + 1];
                    g = y[2 * h];
                    f = y[2 * h + 1];
                    h = G.faceVertexUvs[0];
                    var n = [];
                    n.push(new THREE.UV(i, e));
                    n.push(new THREE.UV(j, l));
                    n.push(new THREE.UV(k, m));
                    n.push(new THREE.UV(g, f));
                    h.push(n)
                }
            }
            function E(b, c, d) {
                for (var e, f, g, h, c = new Uint32Array(a, c, 3 * b), i = new Uint16Array(a, d, b), d = 0; d < b; d++) e = c[3 * d], f = c[3 * d + 1], g = c[3 * d + 2], h = i[d], G.faces.push(new THREE.Face3(e, f, g, null, null, h))
            }
            function I(b, c, d) {
                for (var e, f, g, h, i, c = new Uint32Array(a, c, 4 * b), j = new Uint16Array(a, d, b), d = 0; d < b; d++) e = c[4 * d], f = c[4 * d + 1], g = c[4 * d + 2], h = c[4 * d + 3], i = j[d], G.faces.push(new THREE.Face4(e, f, g, h, null, null, i))
            }
            function J(b, c, d, e) {
                for (var f, g, h, i, j, k, l, c = new Uint32Array(a, c, 3 * b), d = new Uint32Array(a, d, 3 * b), m = new Uint16Array(a, e, b), e = 0; e < b; e++) {
                    f = c[3 * e];
                    g = c[3 * e + 1];
                    h = c[3 * e + 2];
                    j = d[3 * e];
                    k = d[3 * e + 1];
                    l = d[3 * e + 2];
                    i = m[e];
                    var o = H[3 * k],
                        n = H[3 * k + 1];
                    k = H[3 * k + 2];
                    var p = H[3 * l],
                        r = H[3 * l + 1];
                    l = H[3 * l + 2];
                    G.faces.push(new THREE.Face3(f, g, h, [new THREE.Vector3(H[3 * j], H[3 * j + 1], H[3 * j + 2]), new THREE.Vector3(o, n, k), new THREE.Vector3(p, r, l)], null, i))
                }
            }
            function B(b, c, d, e) {
                for (var f, g, h, i, j, k, l, m, o, c = new Uint32Array(a, c, 4 * b), d = new Uint32Array(a, d, 4 * b), n = new Uint16Array(a, e, b), e = 0; e < b; e++) {
                    f = c[4 * e];
                    g = c[4 * e + 1];
                    h = c[4 * e + 2];
                    i = c[4 * e + 3];
                    k = d[4 * e];
                    l = d[4 * e + 1];
                    m = d[4 * e + 2];
                    o = d[4 * e + 3];
                    j = n[e];
                    var p = H[3 * l],
                        r = H[3 * l + 1];
                    l = H[3 * l + 2];
                    var q = H[3 * m],
                        s = H[3 * m + 1];
                    m = H[3 * m + 2];
                    var t = H[3 * o],
                        u = H[3 * o + 1];
                    o = H[3 * o + 2];
                    G.faces.push(new THREE.Face4(f, g, h, i, [new THREE.Vector3(H[3 * k], H[3 * k + 1], H[3 * k + 2]), new THREE.Vector3(p, r, l), new THREE.Vector3(q, s, m), new THREE.Vector3(t, u, o)], null, j))
                }
            }
            var G = this,
                D = 0,
                H = [],
                y = [],
                K, C;
            THREE.Geometry.call(this);
            THREE.Loader.prototype.initMaterials(G, d, b);
            c = function(a, b, c) {
                for (var a = new Uint8Array(a, b, c), d = "", e = 0; e < c; e++) d += String.fromCharCode(a[b + e]);
                return d
            }(a, D, 12);
            f = z(a, D + 12);
            z(a, D + 13);
            z(a, D + 14);
            z(a, D + 15);
            i = z(a, D + 16);
            k = z(a, D + 17);
            j = z(a, D + 18);
            m = z(a, D + 19);
            p = x(a, D + 20);
            n = x(a, D + 20 + 4);
            l = x(a, D + 20 + 8);
            b = x(a, D + 20 + 12);
            o = x(a, D + 20 + 16);
            q = x(a, D + 20 + 20);
            r = x(a, D + 20 + 24);
            s = x(a, D + 20 + 28);
            t = x(a, D + 20 + 32);
            v = x(a, D + 20 + 36);
            u = x(a, D + 20 + 40);
            "Three.js 003" !== c && console.warn("DEPRECATED: binary model seems to be using old format");
            D += f;
            c = 3 * i + m;
            C = 4 * i + m;
            f = b * c;
            K = o * (c + 3 * k);
            i = q * (c + 3 * j);
            m = r * (c + 3 * k + 3 * j);
            c = s * C;
            k = t * (C + 4 * k);
            j = v * (C + 4 * j);
            D +=
            function(b) {
                var b = new Float32Array(a, b, 3 * p),
                    c, d, e, f;
                for (c = 0; c < p; c++) d = b[3 * c], e = b[3 * c + 1], f = b[3 * c + 2], G.vertices.push(new THREE.Vertex(new THREE.Vector3(d, e, f)));
                return 3 * p * Float32Array.BYTES_PER_ELEMENT
            }(D);
            D +=
            function(b) {
                if (n) {
                    var b = new Int8Array(a, b, 3 * n),
                        c, d, e, f;
                    for (c = 0; c < n; c++) d = b[3 * c], e = b[3 * c + 1], f = b[3 * c + 2], H.push(d / 127, e / 127, f / 127)
                }
                return 3 * n * Int8Array.BYTES_PER_ELEMENT
            }(D);
            D += w(3 * n);
            D +=
            function(b) {
                if (l) {
                    var b = new Float32Array(a, b, 2 * l),
                        c, d, e;
                    for (c = 0; c < l; c++) d = b[2 * c], e = b[2 * c + 1], y.push(d, e)
                }
                return 2 * l * Float32Array.BYTES_PER_ELEMENT
            }(D);
            f = D + f + w(2 * b);
            K = f + K + w(2 * o);
            i = K + i + w(2 * q);
            m = i + m + w(2 * r);
            c = m + c + w(2 * s);
            k = c + k + w(2 * t);
            j = k + j + w(2 * v);
            (function(a) {
                if (q) {
                    var b = a + 3 * q * Uint32Array.BYTES_PER_ELEMENT;
                    E(q, a, b + 3 * q * Uint32Array.BYTES_PER_ELEMENT);
                    A(q, b)
                }
            })(K);
            (function(a) {
                if (r) {
                    var b = a + 3 * r * Uint32Array.BYTES_PER_ELEMENT,
                        c = b + 3 * r * Uint32Array.BYTES_PER_ELEMENT;
                    J(r, a, b, c + 3 * r * Uint32Array.BYTES_PER_ELEMENT);
                    A(r, c)
                }
            })(i);
            (function(a) {
                if (v) {
                    var b = a + 4 * v * Uint32Array.BYTES_PER_ELEMENT;
                    I(v, a, b + 4 * v * Uint32Array.BYTES_PER_ELEMENT);
                    F(v, b)
                }
            })(k);
            (function(a) {
                if (u) {
                    var b = a + 4 * u * Uint32Array.BYTES_PER_ELEMENT,
                        c = b + 4 * u * Uint32Array.BYTES_PER_ELEMENT;
                    B(u, a, b, c + 4 * u * Uint32Array.BYTES_PER_ELEMENT);
                    F(u, c)
                }
            })(j);
            b && E(b, D, D + 3 * b * Uint32Array.BYTES_PER_ELEMENT);
            (function(a) {
                if (o) {
                    var b = a + 3 * o * Uint32Array.BYTES_PER_ELEMENT;
                    J(o, a, b, b + 3 * o * Uint32Array.BYTES_PER_ELEMENT)
                }
            })(f);
            s && I(s, m, m + 4 * s * Uint32Array.BYTES_PER_ELEMENT);
            (function(a) {
                if (t) {
                    var b = a + 4 * t * Uint32Array.BYTES_PER_ELEMENT;
                    B(t, a, b, b + 4 * t * Uint32Array.BYTES_PER_ELEMENT)
                }
            })(c);
            this.computeCentroids();
            this.computeFaceNormals();
            THREE.Loader.prototype.hasNormals(this) && this.computeTangents()
        };
    f.prototype = new THREE.Geometry;
    f.prototype.constructor = f;
    b(new f(c))
};
THREE.ColladaLoader = function() {
    function a(a, d, f) {
        P = a;
        d = d || ia;
        void 0 !== f && (a = f.split("/"), a.pop(), ja = 1 > a.length ? "" : a.join("/") + "/");
        if ((a = P.evaluate("//dae:asset", P, K, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null).iterateNext()) && a.childNodes) for (f = 0; f < a.childNodes.length; f++) {
            var i = a.childNodes[f];
            switch (i.nodeName) {
            case "unit":
                (i = i.getAttribute("meter")) && parseFloat(i);
                break;
            case "up_axis":
                Z = i.textContent.charAt(0)
            }
        }
        if (!Q.convertUpAxis || Z === Q.upAxis) V = null;
        else switch (Z) {
        case "X":
            V = "Y" === Q.upAxis ? "XtoY" : "XtoZ";
            break;
        case "Y":
            V = "X" === Q.upAxis ? "YtoX" : "YtoZ";
            break;
        case "Z":
            V = "X" === Q.upAxis ? "ZtoX" : "ZtoY"
        }
        ca = b("//dae:library_images/dae:image", e, "image");
        da = b("//dae:library_materials/dae:material", x, "material");
        ea = b("//dae:library_effects/dae:effect", J, "effect");
        U = b("//dae:library_geometries/dae:geometry", q, "geometry");
        T = b("//dae:library_controllers/dae:controller", h, "controller");
        W = b("//dae:library_animations/dae:animation", G, "animation");
        ga = b(".//dae:library_visual_scenes/dae:visual_scene", j, "visual_scene");
        $ = [];
        aa = [];
        (a = P.evaluate(".//dae:scene/dae:instance_visual_scene", P, K, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null).iterateNext()) ? (a = a.getAttribute("url").replace(/^#/, ""), S = ga[a]) : S = null;
        X = new THREE.Object3D;
        for (a = 0; a < S.nodes.length; a++) X.add(g(S.nodes[a]));
        fa = [];
        c(X);
        a = {
            scene: X,
            morphs: $,
            skins: aa,
            animations: fa,
            dae: {
                images: ca,
                materials: da,
                effects: ea,
                geometries: U,
                controllers: T,
                animations: W,
                visualScenes: ga,
                scene: S
            }
        };
        d && d(a);
        return a
    }
    function b(a, b, c) {
        for (var a = P.evaluate(a, P, K, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null), d = {}, e = a.iterateNext(), f = 0; e;) {
            e = (new b).parse(e);
            if (!e.id || 0 == e.id.length) e.id = c + f++;
            d[e.id] = e;
            e = a.iterateNext()
        }
        return d
    }
    function c(a) {
        var b = S.getChildById(a.name, !0),
            d = null;
        if (b && b.keys) {
            d = {
                fps: 60,
                hierarchy: [{
                    node: b,
                    keys: b.keys,
                    sids: b.sids
                }],
                node: a,
                name: "animation_" + a.name,
                length: 0
            };
            fa.push(d);
            for (var e = 0, f = b.keys.length; e < f; e++) d.length = Math.max(d.length, b.keys[e].time)
        } else d = {
            hierarchy: [{
                keys: [],
                sids: []
            }]
        };
        e = 0;
        for (f = a.children.length; e < f; e++) for (var b = 0, g = c(a.children[e]).hierarchy.length; b < g; b++) d.hierarchy.push({
            keys: [],
            sids: []
        });
        return d
    }
    function d(a, b, c, e) {
        a.world = a.world || new THREE.Matrix4;
        a.world.copy(a.matrix);
        if (a.channels && a.channels.length) {
            var f = a.channels[0].sampler.output[c];
            f instanceof THREE.Matrix4 && a.world.copy(f)
        }
        e && a.world.multiply(e, a.world);
        b.push(a);
        for (e = 0; e < a.nodes.length; e++) d(a.nodes[e], b, c, a.world)
    }
    function f(a, b, c) {
        var e, f = T[b.url];
        if (!f || !f.skin) console.log("ColladaLoader: Could not find skin controller.");
        else if (!b.skeleton || !b.skeleton.length) console.log("ColladaLoader: Could not find the skeleton for the skin. ");
        else {
            var c = 1E6,
                g = -c,
                h = 0;
            for (e in W) for (var i = W[e], j = 0; j < i.sampler.length; j++) {
                var k = i.sampler[j];
                k.create();
                c = Math.min(c, k.startTime);
                g = Math.max(g, k.endTime);
                h = Math.max(h, k.input.length)
            }
            e = h;
            for (var b = S.getChildById(b.skeleton[0], !0) || S.getChildBySid(b.skeleton[0], !0), l, m, g = new THREE.Vector3, o, j = 0; j < a.vertices.length; j++) f.skin.bindShapeMatrix.multiplyVector3(a.vertices[j].position);
            for (c = 0; c < e; c++) {
                h = [];
                i = [];
                for (j = 0; j < a.vertices.length; j++) i.push(new THREE.Vertex(new THREE.Vector3));
                d(b, h, c);
                j = h;
                k = f.skin;
                for (m = 0; m < j.length; m++) if (l = j[m], o = -1, "JOINT" == l.type) {
                    for (var n = 0; n < k.joints.length; n++) if (l.sid == k.joints[n]) {
                        o = n;
                        break
                    }
                    if (0 <= o) {
                        n = k.invBindMatrices[o];
                        l.invBindMatrix = n;
                        l.skinningMatrix = new THREE.Matrix4;
                        l.skinningMatrix.multiply(l.world, n);
                        l.weights = [];
                        for (n = 0; n < k.weights.length; n++) for (var p = 0; p < k.weights[n].length; p++) {
                            var r = k.weights[n][p];
                            r.joint == o && l.weights.push(r)
                        }
                    } else throw "ColladaLoader: Could not find joint '" + l.sid + "'.";
                }
                for (j = 0; j < h.length; j++) if ("JOINT" == h[j].type) for (k = 0; k < h[j].weights.length; k++) l = h[j].weights[k], m = l.index, l = l.weight, o = a.vertices[m], m = i[m], g.x = o.position.x, g.y = o.position.y, g.z = o.position.z, h[j].skinningMatrix.multiplyVector3(g), m.position.x += g.x * l, m.position.y += g.y * l, m.position.z += g.z * l;
                a.morphTargets.push({
                    name: "target_" + c,
                    vertices: i
                })
            }
        }
    }
    function g(a) {
        var b = new THREE.Object3D,
            c, d, e, h;
        for (e = 0; e < a.controllers.length; e++) {
            var i = T[a.controllers[e].url];
            switch (i.type) {
            case "skin":
                if (U[i.skin.source]) {
                    var j = new o;
                    j.url = i.skin.source;
                    j.instance_material = a.controllers[e].instance_material;
                    a.geometries.push(j);
                    c = a.controllers[e]
                } else if (T[i.skin.source] && (d = i = T[i.skin.source], i.morph && U[i.morph.source])) j = new o, j.url = i.morph.source, j.instance_material = a.controllers[e].instance_material, a.geometries.push(j);
                break;
            case "morph":
                if (U[i.morph.source]) j = new o, j.url = i.morph.source, j.instance_material = a.controllers[e].instance_material, a.geometries.push(j), d = a.controllers[e];
                console.log("ColladaLoader: Morph-controller partially supported.")
            }
        }
        for (e = 0; e < a.geometries.length; e++) {
            var i = a.geometries[e],
                j = i.instance_material,
                i = U[i.url],
                k = {},
                l = [],
                m = 0,
                p;
            if (i && i.mesh && i.mesh.primitives) {
                if (0 == b.name.length) b.name = i.id;
                if (j) for (h = 0; h < j.length; h++) {
                    p = j[h];
                    var r = ea[da[p.target].instance_effect.url].shader;
                    r.material.opacity = !r.material.opacity ? 1 : r.material.opacity;
                    k[p.symbol] = m;
                    l.push(r.material);
                    p = r.material;
                    m++
                }
                j = p || new THREE.MeshLambertMaterial({
                    color: 14540253,
                    shading: THREE.FlatShading
                });
                i = i.mesh.geometry3js;
                if (1 < m) {
                    j = new THREE.MeshFaceMaterial;
                    i.materials = l;
                    for (h = 0; h < i.faces.length; h++) l = i.faces[h], l.materialIndex = k[l.daeMaterial]
                }
                if (void 0 !== c) f(i, c), j.morphTargets = !0, j = new THREE.SkinnedMesh(i, j), j.skeleton = c.skeleton, j.skinController = T[c.url], j.skinInstanceController = c, j.name = "skin_" + aa.length, aa.push(j);
                else if (void 0 !== d) {
                    h = i;
                    k = d instanceof n ? T[d.url] : d;
                    if (!k || !k.morph) console.log("could not find morph controller!");
                    else {
                        k = k.morph;
                        for (l = 0; l < k.targets.length; l++) if (m = U[k.targets[l]], m.mesh && m.mesh.primitives && m.mesh.primitives.length) m = m.mesh.primitives[0].geometry, m.vertices.length === h.vertices.length && h.morphTargets.push({
                            name: "target_1",
                            vertices: m.vertices
                        });
                        h.morphTargets.push({
                            name: "target_Z",
                            vertices: h.vertices
                        })
                    }
                    j.morphTargets = !0;
                    j = new THREE.Mesh(i, j);
                    j.name = "morph_" + $.length;
                    $.push(j)
                } else j = new THREE.Mesh(i, j);
                1 < a.geometries.length ? b.add(j) : b = j
            }
        }
        b.name = a.id || "";
        b.matrix = a.matrix;
        c = a.matrix.decompose();
        b.position = c[0];
        b.quaternion = c[1];
        b.useQuaternion = !0;
        b.scale = c[2];
        Q.centerGeometry && b.geometry && (c = THREE.GeometryUtils.center(b.geometry), b.quaternion.multiplyVector3(c.multiplySelf(b.scale)), b.position.subSelf(c));
        for (e = 0; e < a.nodes.length; e++) b.add(g(a.nodes[e], a));
        return b
    }
    function e() {
        this.init_from = this.id = ""
    }
    function h() {
        this.type = this.name = this.id = "";
        this.morph = this.skin = null
    }
    function i() {
        this.weights = this.targets = this.source = this.method = null
    }
    function k() {
        this.source = "";
        this.bindShapeMatrix = null;
        this.invBindMatrices = [];
        this.joints = [];
        this.weights = []
    }
    function j() {
        this.name = this.id = "";
        this.nodes = [];
        this.scene = new THREE.Object3D
    }
    function m() {
        this.sid = this.name = this.id = "";
        this.nodes = [];
        this.controllers = [];
        this.transforms = [];
        this.geometries = [];
        this.channels = [];
        this.matrix = new THREE.Matrix4
    }
    function p() {
        this.type = this.sid = "";
        this.data = [];
        this.obj = null
    }
    function n() {
        this.url = "";
        this.skeleton = [];
        this.instance_material = []
    }
    function l() {
        this.target = this.symbol = ""
    }
    function o() {
        this.url = "";
        this.instance_material = []
    }
    function q() {
        this.id = "";
        this.mesh = null
    }
    function r(a) {
        this.geometry = a.id;
        this.primitives = [];
        this.geometry3js = this.vertices = null
    }
    function s() {}
    function t() {
        this.material = "";
        this.count = 0;
        this.inputs = [];
        this.vcount = null;
        this.p = [];
        this.geometry = new THREE.Geometry
    }
    function v() {
        this.source = "";
        this.stride = this.count = 0;
        this.params = []
    }
    function u() {
        this.input = {}
    }
    function w() {
        this.semantic = "";
        this.offset = 0;
        this.source = "";
        this.set = 0
    }
    function z(a) {
        this.id = a;
        this.type = null
    }
    function x() {
        this.name = this.id = "";
        this.instance_effect = null
    }
    function A() {
        this.color = new THREE.Color(0);
        this.color.setRGB(Math.random(), Math.random(), Math.random());
        this.color.a = 1;
        this.texOpts = this.texcoord = this.texture = null
    }

    function F(a, b) {
        this.type = a;
        this.effect = b;
        this.material = null
    }
    function E(a) {
        this.effect = a;
        this.format = this.init_from = null
    }
    function I(a) {
        this.effect = a;
        this.mipfilter = this.magfilter = this.minfilter = this.wrap_t = this.wrap_s = this.source = null
    }
    function J() {
        this.name = this.id = "";
        this.sampler = this.surface = this.shader = null
    }
    function B() {
        this.url = ""
    }
    function G() {
        this.name = this.id = "";
        this.source = {};
        this.sampler = [];
        this.channel = []
    }
    function D(a) {
        this.animation = a;
        this.target = this.source = "";
        this.member = this.arrIndices = this.arrSyntax = this.dotSyntax = this.sid = this.fullSid = null
    }
    function H(a) {
        this.id = "";
        this.animation = a;
        this.inputs = [];
        this.endTime = this.startTime = this.interpolation = this.strideOut = this.output = this.input = null;
        this.duration = 0
    }
    function y(a) {
        this.targets = [];
        this.time = a
    }
    function K(a) {
        return "dae" == a ? "http://www.collada.org/2005/11/COLLADASchema" : null
    }
    function C(a) {
        for (var a = N(a).split(/\s+/), b = [], c = 0; c < a.length; c++) b.push(parseFloat(a[c]));
        return b
    }
    function L(a) {
        for (var a = N(a).split(/\s+/), b = [], c = 0; c < a.length; c++) b.push(parseInt(a[c], 10));
        return b
    }
    function N(a) {
        return a.replace(/^\s+/, "").replace(/\s+$/, "")
    }
    function M(a, b, c) {
        return a.hasAttribute(b) ? parseInt(a.getAttribute(b), 10) : c
    }
    function O(a, b) {
        if (Q.convertUpAxis && Z !== Q.upAxis) switch (V) {
        case "XtoY":
            var c = a[0];
            a[0] = b * a[1];
            a[1] = c;
            break;
        case "XtoZ":
            c = a[2];
            a[2] = a[1];
            a[1] = a[0];
            a[0] = c;
            break;
        case "YtoX":
            c = a[0];
            a[0] = a[1];
            a[1] = b * c;
            break;
        case "YtoZ":
            c = a[1];
            a[1] = b * a[2];
            a[2] = c;
            break;
        case "ZtoX":
            c = a[0];
            a[0] = a[1];
            a[1] = a[2];
            a[2] = c;
            break;
        case "ZtoY":
            c = a[1], a[1] = a[2], a[2] = b * c
        }
    }
    function R(a, b) {
        var c = [a[b], a[b + 1], a[b + 2]];
        O(c, -1);
        return new THREE.Vector3(c[0], c[1], c[2])
    }
    function ba(a) {
        if (Q.convertUpAxis) {
            var b = [a[0], a[4], a[8]];
            O(b, -1);
            a[0] = b[0];
            a[4] = b[1];
            a[8] = b[2];
            b = [a[1], a[5], a[9]];
            O(b, -1);
            a[1] = b[0];
            a[5] = b[1];
            a[9] = b[2];
            b = [a[2], a[6], a[10]];
            O(b, -1);
            a[2] = b[0];
            a[6] = b[1];
            a[10] = b[2];
            b = [a[0], a[1], a[2]];
            O(b, -1);
            a[0] = b[0];
            a[1] = b[1];
            a[2] = b[2];
            b = [a[4], a[5], a[6]];
            O(b, -1);
            a[4] = b[0];
            a[5] = b[1];
            a[6] = b[2];
            b = [a[8], a[9], a[10]];
            O(b, -1);
            a[8] = b[0];
            a[9] = b[1];
            a[10] = b[2];
            b = [a[3], a[7], a[11]];
            O(b, -1);
            a[3] = b[0];
            a[7] = b[1];
            a[11] = b[2]
        }
        return new THREE.Matrix4(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15])
    }
    var P = null,
        X = null,
        S, ia = null,
        Y = {},
        ca = {},
        W = {},
        T = {},
        U = {},
        da = {},
        ea = {},
        fa, ga, ja, $, aa, ka = THREE.SmoothShading,
        Q = {
            centerGeometry: !1,
            convertUpAxis: !1,
            subdivideFaces: !0,
            upAxis: "Y"
        },
        Z = "Y",
        V = null,
        ha = Math.PI / 180;
    e.prototype.parse = function(a) {
        this.id = a.getAttribute("id");
        for (var b = 0; b < a.childNodes.length; b++) {
            var c = a.childNodes[b];
            if ("init_from" == c.nodeName) this.init_from = c.textContent
        }
        return this
    };
    h.prototype.parse = function(a) {
        this.id = a.getAttribute("id");
        this.name = a.getAttribute("name");
        this.type = "none";
        for (var b = 0; b < a.childNodes.length; b++) {
            var c = a.childNodes[b];
            switch (c.nodeName) {
            case "skin":
                this.skin = (new k).parse(c);
                this.type = c.nodeName;
                break;
            case "morph":
                this.morph = (new i).parse(c), this.type = c.nodeName
            }
        }
        return this
    };
    i.prototype.parse = function(a) {
        var b = {},
            c = [],
            d;
        this.method = a.getAttribute("method");
        this.source = a.getAttribute("source").replace(/^#/, "");
        for (d = 0; d < a.childNodes.length; d++) {
            var e = a.childNodes[d];
            if (1 == e.nodeType) switch (e.nodeName) {
            case "source":
                e = (new z).parse(e);
                b[e.id] = e;
                break;
            case "targets":
                c = this.parseInputs(e);
                break;
            default:
                console.log(e.nodeName)
            }
        }
        for (d = 0; d < c.length; d++) switch (a = c[d], e = b[a.source], a.semantic) {
        case "MORPH_TARGET":
            this.targets = e.read();
            break;
        case "MORPH_WEIGHT":
            this.weights = e.read()
        }
        return this
    };
    i.prototype.parseInputs = function(a) {
        for (var b = [], c = 0; c < a.childNodes.length; c++) {
            var d = a.childNodes[c];
            if (1 == d.nodeType) switch (d.nodeName) {
            case "input":
                b.push((new w).parse(d))
            }
        }
        return b
    };
    k.prototype.parse = function(a) {
        var b = {},
            c, d;
        this.source = a.getAttribute("source").replace(/^#/, "");
        this.invBindMatrices = [];
        this.joints = [];
        this.weights = [];
        for (var e = 0; e < a.childNodes.length; e++) {
            var f = a.childNodes[e];
            if (1 == f.nodeType) switch (f.nodeName) {
            case "bind_shape_matrix":
                f = C(f.textContent);
                this.bindShapeMatrix = ba(f);
                break;
            case "source":
                f = (new z).parse(f);
                b[f.id] = f;
                break;
            case "joints":
                c = f;
                break;
            case "vertex_weights":
                d = f;
                break;
            default:
                console.log(f.nodeName)
            }
        }
        this.parseJoints(c, b);
        this.parseWeights(d, b);
        return this
    };
    k.prototype.parseJoints = function(a, b) {
        for (var c = 0; c < a.childNodes.length; c++) {
            var d = a.childNodes[c];
            if (1 == d.nodeType) switch (d.nodeName) {
            case "input":
                var d = (new w).parse(d),
                    e = b[d.source];
                if ("JOINT" == d.semantic) this.joints = e.read();
                else if ("INV_BIND_MATRIX" == d.semantic) this.invBindMatrices = e.read()
            }
        }
    };
    k.prototype.parseWeights = function(a, b) {
        for (var c, d, e = [], f = 0; f < a.childNodes.length; f++) {
            var g = a.childNodes[f];
            if (1 == g.nodeType) switch (g.nodeName) {
            case "input":
                e.push((new w).parse(g));
                break;
            case "v":
                c = L(g.textContent);
                break;
            case "vcount":
                d = L(g.textContent)
            }
        }
        for (f = g = 0; f < d.length; f++) {
            for (var h = d[f], i = [], j = 0; j < h; j++) {
                for (var k = {}, l = 0; l < e.length; l++) {
                    var m = e[l],
                        o = c[g + m.offset];
                    switch (m.semantic) {
                    case "JOINT":
                        k.joint = o;
                        break;
                    case "WEIGHT":
                        k.weight = b[m.source].data[o]
                    }
                }
                i.push(k);
                g += e.length
            }
            for (j = 0; j < i.length; j++) i[j].index = f;
            this.weights.push(i)
        }
    };
    j.prototype.getChildById = function(a, b) {
        for (var c = 0; c < this.nodes.length; c++) {
            var d = this.nodes[c].getChildById(a, b);
            if (d) return d
        }
        return null
    };
    j.prototype.getChildBySid = function(a, b) {
        for (var c = 0; c < this.nodes.length; c++) {
            var d = this.nodes[c].getChildBySid(a, b);
            if (d) return d
        }
        return null
    };
    j.prototype.parse = function(a) {
        this.id = a.getAttribute("id");
        this.name = a.getAttribute("name");
        this.nodes = [];
        for (var b = 0; b < a.childNodes.length; b++) {
            var c = a.childNodes[b];
            if (1 == c.nodeType) switch (c.nodeName) {
            case "node":
                this.nodes.push((new m).parse(c))
            }
        }
        return this
    };
    m.prototype.getChannelForTransform = function(a) {
        for (var b = 0; b < this.channels.length; b++) {
            var c = this.channels[b],
                d = c.target.split("/");
            d.shift();
            var e = d.shift(),
                f = 0 <= e.indexOf("."),
                g = 0 <= e.indexOf("("),
                h;
            if (f) d = e.split("."), e = d.shift(), d.shift();
            else if (g) {
                h = e.split("(");
                e = h.shift();
                for (d = 0; d < h.length; d++) h[d] = parseInt(h[d].replace(/\)/, ""))
            }
            if (e == a) return c.info = {
                sid: e,
                dotSyntax: f,
                arrSyntax: g,
                arrIndices: h
            }, c
        }
        return null
    };
    m.prototype.getChildById = function(a, b) {
        if (this.id == a) return this;
        if (b) for (var c = 0; c < this.nodes.length; c++) {
            var d = this.nodes[c].getChildById(a, b);
            if (d) return d
        }
        return null
    };
    m.prototype.getChildBySid = function(a, b) {
        if (this.sid == a) return this;
        if (b) for (var c = 0; c < this.nodes.length; c++) {
            var d = this.nodes[c].getChildBySid(a, b);
            if (d) return d
        }
        return null
    };
    m.prototype.getTransformBySid = function(a) {
        for (var b = 0; b < this.transforms.length; b++) if (this.transforms[b].sid == a) return this.transforms[b];
        return null
    };
    m.prototype.parse = function(a) {
        var b;
        this.id = a.getAttribute("id");
        this.sid = a.getAttribute("sid");
        this.name = a.getAttribute("name");
        this.type = a.getAttribute("type");
        this.type = "JOINT" == this.type ? this.type : "NODE";
        this.nodes = [];
        this.transforms = [];
        this.geometries = [];
        this.controllers = [];
        this.matrix = new THREE.Matrix4;
        for (var c = 0; c < a.childNodes.length; c++) if (b = a.childNodes[c], 1 == b.nodeType) switch (b.nodeName) {
        case "node":
            this.nodes.push((new m).parse(b));
            break;
        case "instance_camera":
            break;
        case "instance_controller":
            this.controllers.push((new n).parse(b));
            break;
        case "instance_geometry":
            this.geometries.push((new o).parse(b));
            break;
        case "instance_light":
            break;
        case "instance_node":
            b = b.getAttribute("url").replace(/^#/, "");
            (b = P.evaluate(".//dae:library_nodes//dae:node[@id='" + b + "']", P, K, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null).iterateNext()) && this.nodes.push((new m).parse(b));
            break;
        case "rotate":
        case "translate":
        case "scale":
        case "matrix":
        case "lookat":
        case "skew":
            this.transforms.push((new p).parse(b));
            break;
        case "extra":
            break;
        default:
            console.log(b.nodeName)
        }
        a = [];
        c = 1E6;
        b = -1E6;
        for (var d in W) for (var e = W[d], f = 0; f < e.channel.length; f++) {
            var g = e.channel[f],
                h = e.sampler[f];
            d = g.target.split("/")[0];
            if (d == this.id) h.create(), g.sampler = h, c = Math.min(c, h.startTime), b = Math.max(b, h.endTime), a.push(g)
        }
        if (a.length) this.startTime = c, this.endTime = b;
        if ((this.channels = a) && this.channels.length) {
            d = [];
            a = [];
            c = 0;
            for (e = this.channels.length; c < e; c++) {
                b = this.channels[c];
                f = b.fullSid;
                g = b.member;
                if (Q.convertUpAxis) switch (g) {
                case "X":
                    switch (V) {
                    case "XtoY":
                    case "XtoZ":
                    case "YtoX":
                        g = "Y";
                        break;
                    case "ZtoX":
                        g = "Z"
                    }
                    break;
                case "Y":
                    switch (V) {
                    case "XtoY":
                    case "YtoX":
                    case "ZtoX":
                        g = "X";
                        break;
                    case "XtoZ":
                    case "YtoZ":
                    case "ZtoY":
                        g = "Z"
                    }
                    break;
                case "Z":
                    switch (V) {
                    case "XtoZ":
                        g = "X";
                        break;
                    case "YtoZ":
                    case "ZtoX":
                    case "ZtoY":
                        g = "Y"
                    }
                }
                var h = b.sampler,
                    i = h.input,
                    j = this.getTransformBySid(b.sid);
                if (j) {
                    -1 === a.indexOf(f) && a.push(f);
                    b = 0;
                    for (var k = i.length; b < k; b++) {
                        var l = i[b],
                            r = h.getData(j.type, b),
                            q;
                        q = null;
                        for (var s = 0, t = d.length; s < t && null == q; s++) {
                            var u = d[s];
                            if (u.time === l) q = u;
                            else if (u.time > l) break
                        }
                        if (!q) {
                            q = new y(l);
                            s = -1;
                            t = 0;
                            for (u = d.length; t < u && -1 == s; t++) d[t].time >= l && (s = t);
                            l = s;
                            d.splice(-1 == l ? d.length : l, 0, q)
                        }
                        q.addTarget(f, j, g, r)
                    }
                } else console.log('Could not find transform "' + b.sid + '" in node ' + this.id)
            }
            for (c = 0; c < a.length; c++) {
                e = a[c];
                for (b = 0; b < d.length; b++) if (q = d[b], !q.hasTarget(e)) {
                    h = d;
                    f = q;
                    j = b;
                    g = e;
                    i = void 0;
                    a: {
                        i = j ? j - 1 : 0;
                        for (i = 0 <= i ? i : i + h.length; 0 <= i; i--) if (k = h[i], k.hasTarget(g)) {
                            i = k;
                            break a
                        }
                        i = null
                    }
                    k = void 0;
                    a: {
                        for (j += 1; j < h.length; j++) if (k = h[j], k.hasTarget(g)) break a;
                        k = null
                    }
                    if (i && k) {
                        h = (f.time - i.time) / (k.time - i.time);
                        i = i.getTarget(g);
                        j = k.getTarget(g).data;
                        k = i.data;
                        r = void 0;
                        if (k.length) {
                            r = [];
                            for (l = 0; l < k.length; ++l) r[l] = k[l] + (j[l] - k[l]) * h
                        } else r = k + (j - k) * h;
                        f.addTarget(g, i.transform, i.member, r)
                    }
                }
            }
            this.keys = d;
            this.sids = a
        }
        this.updateMatrix();
        return this
    };
    m.prototype.updateMatrix = function() {
        this.matrix.identity();
        for (var a = 0; a < this.transforms.length; a++) this.transforms[a].apply(this.matrix)
    };
    p.prototype.parse = function(a) {
        this.sid = a.getAttribute("sid");
        this.type = a.nodeName;
        this.data = C(a.textContent);
        this.convert();
        return this
    };
    p.prototype.convert = function() {
        switch (this.type) {
        case "matrix":
            this.obj = ba(this.data);
            break;
        case "rotate":
            this.angle = this.data[3] * ha;
        case "translate":
            O(this.data, -1);
            this.obj = new THREE.Vector3(this.data[0], this.data[1], this.data[2]);
            break;
        case "scale":
            O(this.data, 1);
            this.obj = new THREE.Vector3(this.data[0], this.data[1], this.data[2]);
            break;
        default:
            console.log("Can not convert Transform of type " + this.type)
        }
    };
    p.prototype.apply = function(a) {
        switch (this.type) {
        case "matrix":
            a.multiplySelf(this.obj);
            break;
        case "translate":
            a.translate(this.obj);
            break;
        case "rotate":
            a.rotateByAxis(this.obj, this.angle);
            break;
        case "scale":
            a.scale(this.obj)
        }
    };
    p.prototype.update = function(a, b) {
        switch (this.type) {
        case "matrix":
            console.log("Currently not handling matrix transform updates");
            break;
        case "translate":
        case "scale":
            switch (b) {
            case "X":
                this.obj.x = a;
                break;
            case "Y":
                this.obj.y = a;
                break;
            case "Z":
                this.obj.z = a;
                break;
            default:
                this.obj.x = a[0], this.obj.y = a[1], this.obj.z = a[2]
            }
            break;
        case "rotate":
            switch (b) {
            case "X":
                this.obj.x = a;
                break;
            case "Y":
                this.obj.y = a;
                break;
            case "Z":
                this.obj.z = a;
                break;
            case "ANGLE":
                this.angle = a * ha;
                break;
            default:
                this.obj.x = a[0], this.obj.y = a[1], this.obj.z = a[2], this.angle = a[3] * ha
            }
        }
    };
    n.prototype.parse = function(a) {
        this.url = a.getAttribute("url").replace(/^#/, "");
        this.skeleton = [];
        this.instance_material = [];
        for (var b = 0; b < a.childNodes.length; b++) {
            var c = a.childNodes[b];
            if (1 == c.nodeType) switch (c.nodeName) {
            case "skeleton":
                this.skeleton.push(c.textContent.replace(/^#/, ""));
                break;
            case "bind_material":
                if (c = P.evaluate(".//dae:instance_material", c, K, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null)) for (var d = c.iterateNext(); d;) this.instance_material.push((new l).parse(d)), d = c.iterateNext()
            }
        }
        return this
    };
    l.prototype.parse = function(a) {
        this.symbol = a.getAttribute("symbol");
        this.target = a.getAttribute("target").replace(/^#/, "");
        return this
    };
    o.prototype.parse = function(a) {
        this.url = a.getAttribute("url").replace(/^#/, "");
        this.instance_material = [];
        for (var b = 0; b < a.childNodes.length; b++) {
            var c = a.childNodes[b];
            if (1 == c.nodeType && "bind_material" == c.nodeName) {
                if (a = P.evaluate(".//dae:instance_material", c, K, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null)) for (b = a.iterateNext(); b;) this.instance_material.push((new l).parse(b)), b = a.iterateNext();
                break
            }
        }
        return this
    };
    q.prototype.parse = function(a) {
        this.id = a.getAttribute("id");
        for (var b = 0; b < a.childNodes.length; b++) {
            var c = a.childNodes[b];
            switch (c.nodeName) {
            case "mesh":
                this.mesh = (new r(this)).parse(c)
            }
        }
        return this
    };
    r.prototype.parse = function(a) {
        this.primitives = [];
        var b;
        for (b = 0; b < a.childNodes.length; b++) {
            var c = a.childNodes[b];
            switch (c.nodeName) {
            case "source":
                var d = c.getAttribute("id");
                void 0 == Y[d] && (Y[d] = (new z(d)).parse(c));
                break;
            case "vertices":
                this.vertices = (new u).parse(c);
                break;
            case "triangles":
                this.primitives.push((new t).parse(c));
                break;
            case "polygons":
                console.warn("polygon holes not yet supported!");
            case "polylist":
                this.primitives.push((new s).parse(c))
            }
        }
        this.geometry3js = new THREE.Geometry;
        a = Y[this.vertices.input.POSITION.source].data;
        for (b = 0; b < a.length; b += 3) this.geometry3js.vertices.push(new THREE.Vertex(R(a, b)));
        for (b = 0; b < this.primitives.length; b++) a = this.primitives[b], a.setVertices(this.vertices), this.handlePrimitive(a, this.geometry3js);
        this.geometry3js.computeCentroids();
        this.geometry3js.computeFaceNormals();
        this.geometry3js.computeVertexNormals();
        this.geometry3js.computeBoundingBox();
        return this
    };
    r.prototype.handlePrimitive = function(a, b) {
        var c = 0,
            d, e, f = a.p,
            g = a.inputs,
            h, i, j, k, l = 0,
            m = 3,
            o = [];
        for (d = 0; d < g.length; d++) switch (h = g[d], h.semantic) {
        case "TEXCOORD":
            o.push(h.set)
        }
        for (; c < f.length;) {
            var n = [],
                p = [],
                r = {},
                q = [];
            a.vcount && (m = a.vcount[l++]);
            for (d = 0; d < m; d++) for (e = 0; e < g.length; e++) switch (h = g[e], k = Y[h.source], i = f[c + d * g.length + h.offset], j = k.accessor.params.length, j *= i, h.semantic) {
            case "VERTEX":
                n.push(i);
                break;
            case "NORMAL":
                p.push(R(k.data, j));
                break;
            case "TEXCOORD":
                void 0 === r[h.set] && (r[h.set] = []);
                r[h.set].push(new THREE.UV(k.data[j], 1 - k.data[j + 1]));
                break;
            case "COLOR":
                q.push((new THREE.Color).setRGB(k.data[j], k.data[j + 1], k.data[j + 2]))
            }
            e = null;
            d = [];
            if (3 === m) d.push(new THREE.Face3(n[0], n[1], n[2], [p[0], p[1], p[2]], q.length ? q : new THREE.Color));
            else if (4 === m) d.push(new THREE.Face4(n[0], n[1], n[2], n[3], [p[0], p[1], p[2], p[3]], q.length ? q : new THREE.Color));
            else if (4 < m && Q.subdivideFaces) {
                q = q.length ? q : new THREE.Color;
                for (e = 1; e < m - 1;) d.push(new THREE.Face3(n[0], n[e], n[e + 1], [p[0], p[e++], p[e]], q))
            }
            if (d.length) {
                n = 0;
                for (p = d.length; n < p; n++) {
                    e = d[n];
                    e.daeMaterial = a.material;
                    b.faces.push(e);
                    for (e = 0; e < o.length; e++) q = r[o[e]], q = 4 < m ? [q[0], q[n + 1], q[n + 2]] : 4 === m ? [q[0], q[1], q[2], q[3]] : [q[0], q[1], q[2]], b.faceVertexUvs[e] || (b.faceVertexUvs[e] = []), b.faceVertexUvs[e].push(q)
                }
            } else console.log("dropped face with vcount " + m + " for geometry with id: " + b.id);
            c += g.length * m
        }
    };
    s.prototype = new t;
    s.prototype.constructor = s;
    t.prototype.setVertices = function(a) {
        for (var b = 0; b < this.inputs.length; b++) if (this.inputs[b].source == a.id) this.inputs[b].source = a.input.POSITION.source
    };
    t.prototype.parse = function(a) {
        this.inputs = [];
        this.material = a.getAttribute("material");
        this.count = M(a, "count", 0);
        for (var b = 0; b < a.childNodes.length; b++) {
            var c = a.childNodes[b];
            switch (c.nodeName) {
            case "input":
                this.inputs.push((new w).parse(a.childNodes[b]));
                break;
            case "vcount":
                this.vcount = L(c.textContent);
                break;
            case "p":
                this.p = L(c.textContent)
            }
        }
        return this
    };
    v.prototype.parse = function(a) {
        this.params = [];
        this.source = a.getAttribute("source");
        this.count = M(a, "count", 0);
        this.stride = M(a, "stride", 0);
        for (var b = 0; b < a.childNodes.length; b++) {
            var c = a.childNodes[b];
            if ("param" == c.nodeName) {
                var d = {};
                d.name = c.getAttribute("name");
                d.type = c.getAttribute("type");
                this.params.push(d)
            }
        }
        return this
    };
    u.prototype.parse = function(a) {
        this.id = a.getAttribute("id");
        for (var b = 0; b < a.childNodes.length; b++) if ("input" == a.childNodes[b].nodeName) {
            var c = (new w).parse(a.childNodes[b]);
            this.input[c.semantic] = c
        }
        return this
    };
    w.prototype.parse = function(a) {
        this.semantic = a.getAttribute("semantic");
        this.source = a.getAttribute("source").replace(/^#/, "");
        this.set = M(a, "set", -1);
        this.offset = M(a, "offset", 0);
        if ("TEXCOORD" == this.semantic && 0 > this.set) this.set = 0;
        return this
    };
    z.prototype.parse = function(a) {
        this.id = a.getAttribute("id");
        for (var b = 0; b < a.childNodes.length; b++) {
            var c = a.childNodes[b];
            switch (c.nodeName) {
            case "bool_array":
                for (var d = N(c.textContent).split(/\s+/), e = [], f = 0; f < d.length; f++) e.push("true" == d[f] || "1" == d[f] ? !0 : !1);
                this.data = e;
                this.type = c.nodeName;
                break;
            case "float_array":
                this.data = C(c.textContent);
                this.type = c.nodeName;
                break;
            case "int_array":
                this.data = L(c.textContent);
                this.type = c.nodeName;
                break;
            case "IDREF_array":
            case "Name_array":
                this.data = N(c.textContent).split(/\s+/);
                this.type = c.nodeName;
                break;
            case "technique_common":
                for (d = 0; d < c.childNodes.length; d++) if ("accessor" == c.childNodes[d].nodeName) {
                    this.accessor = (new v).parse(c.childNodes[d]);
                    break
                }
            }
        }
        return this
    };
    z.prototype.read = function() {
        var a = [],
            b = this.accessor.params[0];
        switch (b.type) {
        case "IDREF":
        case "Name":
        case "name":
        case "float":
            return this.data;
        case "float4x4":
            for (b = 0; b < this.data.length; b += 16) {
                var c = this.data.slice(b, b + 16),
                    c = ba(c);
                a.push(c)
            }
            break;
        default:
            console.log("ColladaLoader: Source: Read dont know how to read " + b.type + ".")
        }
        return a
    };
    x.prototype.parse = function(a) {
        this.id = a.getAttribute("id");
        this.name = a.getAttribute("name");
        for (var b = 0; b < a.childNodes.length; b++) if ("instance_effect" == a.childNodes[b].nodeName) {
            this.instance_effect = (new B).parse(a.childNodes[b]);
            break
        }
        return this
    };
    A.prototype.isColor = function() {
        return null == this.texture
    };
    A.prototype.isTexture = function() {
        return null != this.texture
    };
    A.prototype.parse = function(a) {
        for (var b = 0; b < a.childNodes.length; b++) {
            var c = a.childNodes[b];
            if (1 == c.nodeType) switch (c.nodeName) {
            case "color":
                c = C(c.textContent);
                this.color = new THREE.Color(0);
                this.color.setRGB(c[0], c[1], c[2]);
                this.color.a = c[3];
                break;
            case "texture":
                this.texture = c.getAttribute("texture"), this.texcoord = c.getAttribute("texcoord"), this.texOpts = {
                    offsetU: 0,
                    offsetV: 0,
                    repeatU: 1,
                    repeatV: 1,
                    wrapU: 1,
                    wrapV: 1
                }, this.parseTexture(c)
            }
        }
        return this
    };
    A.prototype.parseTexture = function(a) {
        if (!a.childNodes) return this;
        a.childNodes[1] && "extra" === a.childNodes[1].nodeName && (a = a.childNodes[1], a.childNodes[1] && "technique" === a.childNodes[1].nodeName && (a = a.childNodes[1]));
        for (var b = 0; b < a.childNodes.length; b++) {
            var c = a.childNodes[b];
            switch (c.nodeName) {
            case "offsetU":
            case "offsetV":
            case "repeatU":
            case "repeatV":
                this.texOpts[c.nodeName] = parseFloat(c.textContent);
                break;
            case "wrapU":
            case "wrapV":
                this.texOpts[c.nodeName] = parseInt(c.textContent);
                break;
            default:
                this.texOpts[c.nodeName] = c.textContent
            }
        }
        return this
    };
    F.prototype.parse = function(a) {
        for (var b = 0; b < a.childNodes.length; b++) {
            var c = a.childNodes[b];
            if (1 == c.nodeType) switch (c.nodeName) {
            case "ambient":
            case "emission":
            case "diffuse":
            case "specular":
            case "transparent":
                this[c.nodeName] = (new A).parse(c);
                break;
            case "shininess":
            case "reflectivity":
            case "transparency":
                var d;
                d = P.evaluate(".//dae:float", c, K, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
                for (var e = d.iterateNext(), f = []; e;) f.push(e), e = d.iterateNext();
                d = f;
                0 < d.length && (this[c.nodeName] = parseFloat(d[0].textContent))
            }
        }
        this.create();
        return this
    };
    F.prototype.create = function() {
        var a = {},
            b = void 0 !== this.transparency && 1 > this.transparency,
            c;
        for (c in this) switch (c) {
        case "ambient":
        case "emission":
        case "diffuse":
        case "specular":
            var d = this[c];
            if (d instanceof A) if (d.isTexture()) {
                if (this.effect.sampler && this.effect.surface && this.effect.sampler.source == this.effect.surface.sid) {
                    var e = ca[this.effect.surface.init_from];
                    if (e) e = THREE.ImageUtils.loadTexture(ja + e.init_from), e.wrapS = d.texOpts.wrapU ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping, e.wrapT = d.texOpts.wrapV ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping, e.offset.x = d.texOpts.offsetU, e.offset.y = d.texOpts.offsetV, e.repeat.x = d.texOpts.repeatU, e.repeat.y = d.texOpts.repeatV, a.map = e
                }
            } else "diffuse" == c ? a.color = d.color.getHex() : b || (a[c] = d.color.getHex());
            break;
        case "shininess":
        case "reflectivity":
            a[c] = this[c];
            break;
        case "transparency":
            if (b) a.transparent = !0, a.opacity = this[c], b = !0
        }
        a.shading = ka;
        return this.material = new THREE.MeshLambertMaterial(a)
    };
    E.prototype.parse = function(a) {
        for (var b = 0; b < a.childNodes.length; b++) {
            var c = a.childNodes[b];
            if (1 == c.nodeType) switch (c.nodeName) {
            case "init_from":
                this.init_from = c.textContent;
                break;
            case "format":
                this.format = c.textContent;
                break;
            default:
                console.log("unhandled Surface prop: " + c.nodeName)
            }
        }
        return this
    };
    I.prototype.parse = function(a) {
        for (var b = 0; b < a.childNodes.length; b++) {
            var c = a.childNodes[b];
            if (1 == c.nodeType) switch (c.nodeName) {
            case "source":
                this.source = c.textContent;
                break;
            case "minfilter":
                this.minfilter = c.textContent;
                break;
            case "magfilter":
                this.magfilter = c.textContent;
                break;
            case "mipfilter":
                this.mipfilter = c.textContent;
                break;
            case "wrap_s":
                this.wrap_s = c.textContent;
                break;
            case "wrap_t":
                this.wrap_t = c.textContent;
                break;
            default:
                console.log("unhandled Sampler2D prop: " + c.nodeName)
            }
        }
        return this
    };
    J.prototype.create = function() {
        if (null == this.shader) return null
    };
    J.prototype.parse = function(a) {
        this.id = a.getAttribute("id");
        this.name = a.getAttribute("name");
        this.shader = null;
        for (var b = 0; b < a.childNodes.length; b++) {
            var c = a.childNodes[b];
            if (1 == c.nodeType) switch (c.nodeName) {
            case "profile_COMMON":
                this.parseTechnique(this.parseProfileCOMMON(c))
            }
        }
        return this
    };
    J.prototype.parseNewparam = function(a) {
        for (var b = a.getAttribute("sid"), c = 0; c < a.childNodes.length; c++) {
            var d = a.childNodes[c];
            if (1 == d.nodeType) switch (d.nodeName) {
            case "surface":
                this.surface = (new E(this)).parse(d);
                this.surface.sid = b;
                break;
            case "sampler2D":
                this.sampler = (new I(this)).parse(d);
                this.sampler.sid = b;
                break;
            case "extra":
                break;
            default:
                console.log(d.nodeName)
            }
        }
    };
    J.prototype.parseProfileCOMMON = function(a) {
        for (var b, c = 0; c < a.childNodes.length; c++) {
            var d = a.childNodes[c];
            if (1 == d.nodeType) switch (d.nodeName) {
            case "profile_COMMON":
                this.parseProfileCOMMON(d);
                break;
            case "technique":
                b = d;
                break;
            case "newparam":
                this.parseNewparam(d);
                break;
            case "extra":
                break;
            default:
                console.log(d.nodeName)
            }
        }
        return b
    };
    J.prototype.parseTechnique = function(a) {
        for (var b = 0; b < a.childNodes.length; b++) {
            var c = a.childNodes[b];
            if (1 == c.nodeType) switch (c.nodeName) {
            case "constant":
            case "lambert":
            case "blinn":
            case "phong":
                this.shader = (new F(c.nodeName, this)).parse(c)
            }
        }
    };
    B.prototype.parse = function(a) {
        this.url = a.getAttribute("url").replace(/^#/, "");
        return this
    };
    G.prototype.parse = function(a) {
        this.id = a.getAttribute("id");
        this.name = a.getAttribute("name");
        this.source = {};
        for (var b = 0; b < a.childNodes.length; b++) {
            var c = a.childNodes[b];
            if (1 == c.nodeType) switch (c.nodeName) {
            case "source":
                c = (new z).parse(c);
                this.source[c.id] = c;
                break;
            case "sampler":
                this.sampler.push((new H(this)).parse(c));
                break;
            case "channel":
                this.channel.push((new D(this)).parse(c))
            }
        }
        return this
    };
    D.prototype.parse = function(a) {
        this.source = a.getAttribute("source").replace(/^#/, "");
        this.target = a.getAttribute("target");
        var b = this.target.split("/");
        b.shift();
        var a = b.shift(),
            c = 0 <= a.indexOf("."),
            d = 0 <= a.indexOf("(");
        if (c) b = a.split("."), this.sid = b.shift(), this.member = b.shift();
        else if (d) {
            b = a.split("(");
            this.sid = b.shift();
            for (var e = 0; e < b.length; e++) b[e] = parseInt(b[e].replace(/\)/, ""));
            this.arrIndices = b
        } else this.sid = a;
        this.fullSid = a;
        this.dotSyntax = c;
        this.arrSyntax = d;
        return this
    };
    H.prototype.parse = function(a) {
        this.id = a.getAttribute("id");
        this.inputs = [];
        for (var b = 0; b < a.childNodes.length; b++) {
            var c = a.childNodes[b];
            if (1 == c.nodeType) switch (c.nodeName) {
            case "input":
                this.inputs.push((new w).parse(c))
            }
        }
        return this
    };
    H.prototype.create = function() {
        for (var a = 0; a < this.inputs.length; a++) {
            var b = this.inputs[a],
                c = this.animation.source[b.source];
            switch (b.semantic) {
            case "INPUT":
                this.input = c.read();
                break;
            case "OUTPUT":
                this.output = c.read();
                this.strideOut = c.accessor.stride;
                break;
            case "INTERPOLATION":
                this.interpolation = c.read();
                break;
            case "IN_TANGENT":
                break;
            case "OUT_TANGENT":
                break;
            default:
                console.log(b.semantic)
            }
        }
        this.duration = this.endTime = this.startTime = 0;
        if (this.input.length) {
            this.startTime = 1E8;
            this.endTime = -1E8;
            for (a = 0; a < this.input.length; a++) this.startTime = Math.min(this.startTime, this.input[a]), this.endTime = Math.max(this.endTime, this.input[a]);
            this.duration = this.endTime - this.startTime
        }
    };
    H.prototype.getData = function(a, b) {
        var c;
        if (1 < this.strideOut) {
            c = [];
            for (var b = b * this.strideOut, d = 0; d < this.strideOut; ++d) c[d] = this.output[b + d];
            if (3 === this.strideOut) switch (a) {
            case "rotate":
            case "translate":
                O(c, -1);
                break;
            case "scale":
                O(c, 1)
            }
        } else c = this.output[b];
        return c
    };
    y.prototype.addTarget = function(a, b, c, d) {
        this.targets.push({
            sid: a,
            member: c,
            transform: b,
            data: d
        })
    };
    y.prototype.apply = function(a) {
        for (var b = 0; b < this.targets.length; ++b) {
            var c = this.targets[b];
            (!a || c.sid === a) && c.transform.update(c.data, c.member)
        }
    };
    y.prototype.getTarget = function(a) {
        for (var b = 0; b < this.targets.length; ++b) if (this.targets[b].sid === a) return this.targets[b];
        return null
    };
    y.prototype.hasTarget = function(a) {
        for (var b = 0; b < this.targets.length; ++b) if (this.targets[b].sid === a) return !0;
        return !1
    };
    y.prototype.interpolate = function(a, b) {
        for (var c = 0; c < this.targets.length; ++c) {
            var d = this.targets[c],
                e = a.getTarget(d.sid);
            if (e) {
                var f = (b - this.time) / (a.time - this.time),
                    g = e.data,
                    h = d.data;
                if (0 > f || 1 < f) console.log("Key.interpolate: Warning! Scale out of bounds:" + f), f = 0 > f ? 0 : 1;
                if (h.length) for (var e = [], i = 0; i < h.length; ++i) e[i] = h[i] + (g[i] - h[i]) * f;
                else e = h + (g - h) * f
            } else e = d.data;
            d.transform.update(e, d.member)
        }
    };
    return {
        load: function(b, c, d) {
            var e = 0;
            if (document.implementation && document.implementation.createDocument) {
                var f = new XMLHttpRequest;
                f.overrideMimeType && f.overrideMimeType("text/xml");
                f.onreadystatechange = function() {
                    if (4 == f.readyState) {
                        if (0 == f.status || 200 == f.status) f.responseXML ? (ia = c, a(f.responseXML, void 0, b)) : console.error("ColladaLoader: Empty or non-existing file (" + b + ")")
                    } else 3 == f.readyState && d && (0 == e && (e = f.getResponseHeader("Content-Length")), d({
                        total: e,
                        loaded: f.responseText.length
                    }))
                };
                f.open("GET", b, !0);
                f.send(null)
            } else alert("Don't know how to parse XML!")
        },
        parse: a,
        setPreferredShading: function(a) {
            ka = a
        },
        applySkin: f,
        geometries: U,
        options: Q
    }
};
THREE.JSONLoader = function(a) {
    THREE.Loader.call(this, a)
};
THREE.JSONLoader.prototype = new THREE.Loader;
THREE.JSONLoader.prototype.constructor = THREE.JSONLoader;
THREE.JSONLoader.prototype.supr = THREE.Loader.prototype;
THREE.JSONLoader.prototype.load = function(a, b, c) {
    if (a instanceof Object) console.warn("DEPRECATED: JSONLoader( parameters ) is now JSONLoader( url, callback, texturePath )."), c = a, a = c.model, b = c.callback, c = c.texture_path;
    c = c ? c : this.extractUrlbase(a);
    this.onLoadStart();
    this.loadAjaxJSON(this, a, b, c)
};
THREE.JSONLoader.prototype.loadAjaxJSON = function(a, b, c, d, f) {
    var g = new XMLHttpRequest,
        e = 0;
    g.onreadystatechange = function() {
        if (4 == g.readyState) if (200 == g.status || 0 == g.status) {
            try {
                var h = JSON.parse(g.responseText)
            } catch (i) {
                console.warn("DEPRECATED: [" + b + "] seems to be using old model format")
            }
            a.createModel(h, c, d);
            a.onLoadComplete()
        } else console.error("Couldn't load [" + b + "] [" + g.status + "]");
        else 3 == g.readyState ? f && (0 == e && (e = g.getResponseHeader("Content-Length")), f({
            total: e,
            loaded: g.responseText.length
        })) : 2 == g.readyState && (e = g.getResponseHeader("Content-Length"))
    };
    g.open("GET", b, !0);
    g.overrideMimeType && g.overrideMimeType("text/plain; charset=x-user-defined");
    g.setRequestHeader("Content-Type", "text/plain");
    g.send(null)
};
THREE.JSONLoader.prototype.createModel = function(a, b, c) {
    var d = new THREE.Geometry,
        f = void 0 !== a.scale ? 1 / a.scale : 1;
    this.initMaterials(d, a.materials, c);
    (function(b) {
        if (void 0 === a.metadata || void 0 === a.metadata.formatVersion || 3 !== a.metadata.formatVersion) console.error("Deprecated file format.");
        else {
            var c, f, i, k, j, m, p, n, l, o, q, r, s, t, v = a.faces;
            m = a.vertices;
            var u = a.normals,
                w = a.colors,
                z = 0;
            for (c = 0; c < a.uvs.length; c++) a.uvs[c].length && z++;
            for (c = 0; c < z; c++) d.faceUvs[c] = [], d.faceVertexUvs[c] = [];
            k = 0;
            for (j = m.length; k < j;) p = new THREE.Vertex, p.position.x = m[k++] * b, p.position.y = m[k++] * b, p.position.z = m[k++] * b, d.vertices.push(p);
            k = 0;
            for (j = v.length; k < j;) {
                b = v[k++];
                m = b & 1;
                i = b & 2;
                c = b & 4;
                f = b & 8;
                n = b & 16;
                p = b & 32;
                o = b & 64;
                b &= 128;
                m ? (q = new THREE.Face4, q.a = v[k++], q.b = v[k++], q.c = v[k++], q.d = v[k++], m = 4) : (q = new THREE.Face3, q.a = v[k++], q.b = v[k++], q.c = v[k++], m = 3);
                if (i) i = v[k++], q.materialIndex = i;
                i = d.faces.length;
                if (c) for (c = 0; c < z; c++) r = a.uvs[c], l = v[k++], t = r[2 * l], l = r[2 * l + 1], d.faceUvs[c][i] = new THREE.UV(t, l);
                if (f) for (c = 0; c < z; c++) {
                    r = a.uvs[c];
                    s = [];
                    for (f = 0; f < m; f++) l = v[k++], t = r[2 * l], l = r[2 * l + 1], s[f] = new THREE.UV(t, l);
                    d.faceVertexUvs[c][i] = s
                }
                if (n) n = 3 * v[k++], f = new THREE.Vector3, f.x = u[n++], f.y = u[n++], f.z = u[n], q.normal = f;
                if (p) for (c = 0; c < m; c++) n = 3 * v[k++], f = new THREE.Vector3, f.x = u[n++], f.y = u[n++], f.z = u[n], q.vertexNormals.push(f);
                if (o) p = v[k++], p = new THREE.Color(w[p]), q.color = p;
                if (b) for (c = 0; c < m; c++) p = v[k++], p = new THREE.Color(w[p]), q.vertexColors.push(p);
                d.faces.push(q)
            }
        }
    })(f);
    (function() {
        var b, c, f, i;
        if (a.skinWeights) for (b = 0, c = a.skinWeights.length; b < c; b += 2) f = a.skinWeights[b], i = a.skinWeights[b + 1], d.skinWeights.push(new THREE.Vector4(f, i, 0, 0));
        if (a.skinIndices) for (b = 0, c = a.skinIndices.length; b < c; b += 2) f = a.skinIndices[b], i = a.skinIndices[b + 1], d.skinIndices.push(new THREE.Vector4(f, i, 0, 0));
        d.bones = a.bones;
        d.animation = a.animation
    })();
    (function(b) {
        if (void 0 !== a.morphTargets) {
            var c, f, i, k, j, m, p, n, l;
            for (c = 0, f = a.morphTargets.length; c < f; c++) {
                d.morphTargets[c] = {};
                d.morphTargets[c].name = a.morphTargets[c].name;
                d.morphTargets[c].vertices = [];
                n = d.morphTargets[c].vertices;
                l = a.morphTargets[c].vertices;
                for (i = 0, k = l.length; i < k; i += 3) j = l[i] * b, m = l[i + 1] * b, p = l[i + 2] * b, n.push(new THREE.Vertex(new THREE.Vector3(j, m, p)))
            }
        }
        if (void 0 !== a.morphColors) for (c = 0, f = a.morphColors.length; c < f; c++) {
            d.morphColors[c] = {};
            d.morphColors[c].name = a.morphColors[c].name;
            d.morphColors[c].colors = [];
            k = d.morphColors[c].colors;
            j = a.morphColors[c].colors;
            for (b = 0, i = j.length; b < i; b += 3) m = new THREE.Color(16755200), m.setRGB(j[b], j[b + 1], j[b + 2]), k.push(m)
        }
    })(f);
    d.computeCentroids();
    d.computeFaceNormals();
    this.hasNormals(d) && d.computeTangents();
    b(d)
};
THREE.SceneLoader = function() {
    this.onLoadStart = function() {};
    this.onLoadProgress = function() {};
    this.onLoadComplete = function() {};
    this.callbackSync = function() {};
    this.callbackProgress = function() {}
};
THREE.SceneLoader.prototype.constructor = THREE.SceneLoader;
THREE.SceneLoader.prototype.load = function(a, b) {
    var c = this,
        d = new XMLHttpRequest;
    d.onreadystatechange = function() {
        if (4 == d.readyState) if (200 == d.status || 0 == d.status) try {
            var f = JSON.parse(d.responseText);
            void 0 === f.metadata || void 0 === f.metadata.formatVersion || 3 !== f.metadata.formatVersion ? console.error("Deprecated file format.") : c.createScene(f, b, a)
        } catch (g) {
            console.error(g), console.warn("DEPRECATED: [" + a + "] seems to be using old model format")
        } else console.error("Couldn't load [" + a + "] [" + d.status + "]")
    };
    d.open("GET", a, !0);
    d.overrideMimeType && d.overrideMimeType("text/plain; charset=x-user-defined");
    d.setRequestHeader("Content-Type", "text/plain");
    d.send(null)
};
THREE.SceneLoader.prototype.createScene = function(a, b, c) {
    function d(a, b) {
        return "relativeToHTML" == b ? a : k + "/" + a
    }
    function f() {
        var a;
        for (p in B.objects) if (!C.objects[p]) if (r = B.objects[p], void 0 !== r.geometry) {
            if (F = C.geometries[r.geometry]) {
                a = !1;
                for (L = 0; L < r.materials.length; L++) J = C.materials[r.materials[L]], a = J instanceof THREE.ShaderMaterial;
                a && F.computeTangents();
                v = r.position;
                u = r.rotation;
                w = r.quaternion;
                z = r.scale;
                w = 0;
                0 == J.length && (J = new THREE.MeshFaceMaterial);
                1 < J.length && (J = new THREE.MeshFaceMaterial);
                a = new THREE.Mesh(F, J);
                a.name = p;
                a.position.set(v[0], v[1], v[2]);
                w ? (a.quaternion.set(w[0], w[1], w[2], w[3]), a.useQuaternion = !0) : a.rotation.set(u[0], u[1], u[2]);
                a.scale.set(z[0], z[1], z[2]);
                a.visible = r.visible;
                C.scene.add(a);
                C.objects[p] = a;
                if (r.meshCollider) {
                    var b = THREE.CollisionUtils.MeshColliderWBox(a);
                    C.scene.collisions.colliders.push(b)
                }
                if (r.castsShadow) b = new THREE.ShadowVolume(F), C.scene.add(b), b.position = a.position, b.rotation = a.rotation, b.scale = a.scale;
                r.trigger && "none" != r.trigger.toLowerCase() && (b = {
                    type: r.trigger,
                    object: r
                }, C.triggers[a.name] = b)
            }
        } else v = r.position, u = r.rotation, w = r.quaternion, z = r.scale, w = 0, a = new THREE.Object3D, a.name = p, a.position.set(v[0], v[1], v[2]), w ? (a.quaternion.set(w[0], w[1], w[2], w[3]), a.useQuaternion = !0) : a.rotation.set(u[0], u[1], u[2]), a.scale.set(z[0], z[1], z[2]), a.visible = void 0 !== r.visible ? r.visible : !1, C.scene.add(a), C.objects[p] = a, C.empties[p] = a, r.trigger && "none" != r.trigger.toLowerCase() && (b = {
            type: r.trigger,
            object: r
        }, C.triggers[a.name] = b)
    }
    function g(a) {
        return function(b) {
            C.geometries[a] = b;
            f();
            D -= 1;
            i.onLoadComplete();
            h()
        }
    }
    function e(a) {
        return function(b) {
            C.geometries[a] = b
        }
    }
    function h() {
        i.callbackProgress({
            totalModels: y,
            totalTextures: K,
            loadedModels: y - D,
            loadedTextures: K - H
        }, C);
        i.onLoadProgress();
        0 == D && 0 == H && b(C)
    }
    var i = this,
        k = THREE.Loader.prototype.extractUrlbase(c),
        j, m, p, n, l, o, q, r, s, t, v, u, w, z, x, A, F, E, I, J, B, G, D, H, y, K, C;
    B = a;
    c = new THREE.BinaryLoader;
    G = new THREE.JSONLoader;
    H = D = 0;
    C = {
        scene: new THREE.Scene,
        geometries: {},
        materials: {},
        textures: {},
        objects: {},
        cameras: {},
        lights: {},
        fogs: {},
        triggers: {},
        empties: {}
    };
    a = !1;
    for (p in B.objects) if (r = B.objects[p], r.meshCollider) {
        a = !0;
        break
    }
    if (a) C.scene.collisions = new THREE.CollisionSystem;
    if (B.transform) a = B.transform.position, s = B.transform.rotation, x = B.transform.scale, a && C.scene.position.set(a[0], a[1], a[2]), s && C.scene.rotation.set(s[0], s[1], s[2]), x && C.scene.scale.set(x[0], x[1], x[2]), (a || s || x) && C.scene.updateMatrix();
    a = function() {
        H -= 1;
        h();
        i.onLoadComplete()
    };
    for (l in B.cameras) x = B.cameras[l], "perspective" == x.type ? E = new THREE.PerspectiveCamera(x.fov, x.aspect, x.near, x.far) : "ortho" == x.type && (E = new THREE.OrthographicCamera(x.left, x.right, x.top, x.bottom, x.near, x.far)), v = x.position, s = x.target, x = x.up, E.position.set(v[0], v[1], v[2]), E.target = new THREE.Vector3(s[0], s[1], s[2]), x && E.up.set(x[0], x[1], x[2]), C.cameras[l] = E;
    for (n in B.lights) s = B.lights[n], l = void 0 !== s.color ? s.color : 16777215, E = void 0 !== s.intensity ? s.intensity : 1, "directional" == s.type ? (v = s.direction, t = new THREE.DirectionalLight(l, E), t.position.set(v[0], v[1], v[2]), t.position.normalize()) : "point" == s.type ? (v = s.position, t = s.distance, t = new THREE.PointLight(l, E, t), t.position.set(v[0], v[1], v[2])) : "ambient" == s.type && (t = new THREE.AmbientLight(l)), C.scene.add(t), C.lights[n] = t;
    for (o in B.fogs) n = B.fogs[o], "linear" == n.type ? I = new THREE.Fog(0, n.near, n.far) : "exp2" == n.type && (I = new THREE.FogExp2(0, n.density)), x = n.color, I.color.setRGB(x[0], x[1], x[2]), C.fogs[o] = I;
    if (C.cameras && B.defaults.camera) C.currentCamera = C.cameras[B.defaults.camera];
    if (C.fogs && B.defaults.fog) C.scene.fog = C.fogs[B.defaults.fog];
    x = B.defaults.bgcolor;
    C.bgColor = new THREE.Color;
    C.bgColor.setRGB(x[0], x[1], x[2]);
    C.bgColorAlpha = B.defaults.bgalpha;
    for (j in B.geometries) if (o = B.geometries[j], "bin_mesh" == o.type || "ascii_mesh" == o.type) D += 1, i.onLoadStart();
    y = D;
    for (j in B.geometries) o = B.geometries[j], "cube" == o.type ? (F = new THREE.CubeGeometry(o.width, o.height, o.depth, o.segmentsWidth, o.segmentsHeight, o.segmentsDepth, null, o.flipped, o.sides), C.geometries[j] = F) : "plane" == o.type ? (F = new THREE.PlaneGeometry(o.width, o.height, o.segmentsWidth, o.segmentsHeight), C.geometries[j] = F) : "sphere" == o.type ? (F = new THREE.SphereGeometry(o.radius, o.segmentsWidth, o.segmentsHeight), C.geometries[j] = F) : "cylinder" == o.type ? (F = new THREE.CylinderGeometry(o.topRad, o.botRad, o.height, o.radSegs, o.heightSegs), C.geometries[j] = F) : "torus" == o.type ? (F = new THREE.TorusGeometry(o.radius, o.tube, o.segmentsR, o.segmentsT), C.geometries[j] = F) : "icosahedron" == o.type ? (F = new THREE.IcosahedronGeometry(o.subdivisions), C.geometries[j] = F) : "bin_mesh" == o.type ? c.load(d(o.url, B.urlBaseType), g(j)) : "ascii_mesh" == o.type ? G.load(d(o.url, B.urlBaseType), g(j)) : "embedded_mesh" == o.type && (o = B.embeds[o.id]) && G.createModel(o, e(j), "");
    for (q in B.textures) if (j = B.textures[q], j.url instanceof Array) {
        H += j.url.length;
        for (o = 0; o < j.url.length; o++) i.onLoadStart()
    } else H += 1, i.onLoadStart();
    K = H;
    for (q in B.textures) {
        j = B.textures[q];
        if (void 0 != j.mapping && void 0 != THREE[j.mapping]) j.mapping = new THREE[j.mapping];
        if (j.url instanceof Array) {
            o = [];
            for (var L = 0; L < j.url.length; L++) o[L] = d(j.url[L], B.urlBaseType);
            o = THREE.ImageUtils.loadTextureCube(o, j.mapping, a)
        } else {
            o = THREE.ImageUtils.loadTexture(d(j.url, B.urlBaseType), j.mapping, a);
            if (void 0 != THREE[j.minFilter]) o.minFilter = THREE[j.minFilter];
            if (void 0 != THREE[j.magFilter]) o.magFilter = THREE[j.magFilter];
            if (j.repeat) {
                o.repeat.set(j.repeat[0], j.repeat[1]);
                if (1 != j.repeat[0]) o.wrapS = THREE.RepeatWrapping;
                if (1 != j.repeat[1]) o.wrapT = THREE.RepeatWrapping
            }
            j.offset && o.offset.set(j.offset[0], j.offset[1]);
            if (j.wrap) {
                I = {
                    repeat: THREE.RepeatWrapping,
                    mirror: THREE.MirroredRepeatWrapping
                };
                if (void 0 !== I[j.wrap[0]]) o.wrapS = I[j.wrap[0]];
                if (void 0 !== I[j.wrap[1]]) o.wrapT = I[j.wrap[1]]
            }
        }
        C.textures[q] = o
    }
    for (m in B.materials) {
        q = B.materials[m];
        for (A in q.parameters) if ("envMap" == A || "map" == A || "lightMap" == A) q.parameters[A] = C.textures[q.parameters[A]];
        else if ("shading" == A) q.parameters[A] = "flat" == q.parameters[A] ? THREE.FlatShading : THREE.SmoothShading;
        else if ("blending" == A) q.parameters[A] = THREE[q.parameters[A]] ? THREE[q.parameters[A]] : THREE.NormalBlending;
        else if ("combine" == A) q.parameters[A] = "MixOperation" == q.parameters[A] ? THREE.MixOperation : THREE.MultiplyOperation;
        else if ("vertexColors" == A) if ("face" == q.parameters[A]) q.parameters[A] = THREE.FaceColors;
        else if (q.parameters[A]) q.parameters[A] = THREE.VertexColors;
        if (void 0 !== q.parameters.opacity && 1 > q.parameters.opacity) q.parameters.transparent = !0;
        if (q.parameters.normalMap) {
            j = THREE.ShaderUtils.lib.normal;
            a = THREE.UniformsUtils.clone(j.uniforms);
            o = q.parameters.color;
            I = q.parameters.specular;
            c = q.parameters.ambient;
            G = q.parameters.shininess;
            a.tNormal.texture = C.textures[q.parameters.normalMap];
            if (q.parameters.normalMapFactor) a.uNormalScale.value = q.parameters.normalMapFactor;
            if (q.parameters.map) a.tDiffuse.texture = q.parameters.map, a.enableDiffuse.value = !0;
            if (q.parameters.lightMap) a.tAO.texture = q.parameters.lightMap, a.enableAO.value = !0;
            if (q.parameters.specularMap) a.tSpecular.texture = C.textures[q.parameters.specularMap], a.enableSpecular.value = !0;
            a.uDiffuseColor.value.setHex(o);
            a.uSpecularColor.value.setHex(I);
            a.uAmbientColor.value.setHex(c);
            a.uShininess.value = G;
            if (q.parameters.opacity) a.uOpacity.value = q.parameters.opacity;
            q = new THREE.ShaderMaterial({
                fragmentShader: j.fragmentShader,
                vertexShader: j.vertexShader,
                uniforms: a,
                lights: !0,
                fog: !0
            })
        } else q = new THREE[q.type](q.parameters);
        C.materials[m] = q
    }
    f();
    i.callbackSync(C);
    h()
};
THREE.UTF8Loader = function() {};
THREE.UTF8Loader.prototype = new THREE.UTF8Loader;
THREE.UTF8Loader.prototype.constructor = THREE.UTF8Loader;
THREE.UTF8Loader.prototype.load = function(a, b, c) {
    if (a instanceof Object) console.warn("DEPRECATED: UTF8Loader( parameters ) is now UTF8Loader( url, callback, metaData )."), c = a, a = c.model, b = c.callback, c = {
        scale: c.scale,
        offsetX: c.offsetX,
        offsetY: c.offsetY,
        offsetZ: c.offsetZ
    };
    var d = new XMLHttpRequest,
        f = void 0 !== c.scale ? c.scale : 1,
        g = void 0 !== c.offsetX ? c.offsetX : 0,
        e = void 0 !== c.offsetY ? c.offsetY : 0,
        h = void 0 !== c.offsetZ ? c.offsetZ : 0;
    d.onreadystatechange = function() {
        4 == d.readyState ? 200 == d.status || 0 == d.status ? THREE.UTF8Loader.prototype.createModel(d.responseText, b, f, g, e, h) : alert("Couldn't load [" + a + "] [" + d.status + "]") : 3 != d.readyState && 2 == d.readyState && d.getResponseHeader("Content-Length")
    };
    d.open("GET", a, !0);
    d.send(null)
};
THREE.UTF8Loader.prototype.decompressMesh = function(a) {
    var b = a.charCodeAt(0);
    57344 <= b && (b -= 2048);
    b++;
    for (var c = new Float32Array(8 * b), d = 1, f = 0; 8 > f; f++) {
        for (var g = 0, e = 0; e < b; ++e) {
            var h = a.charCodeAt(e + d),
                g = g + (h >> 1 ^ -(h & 1));
            c[8 * e + f] = g
        }
        d += b
    }
    b = a.length - d;
    g = new Uint16Array(b);
    for (f = e = 0; f < b; f++) h = a.charCodeAt(f + d), g[f] = e - h, 0 == h && e++;
    return [c, g]
};
THREE.UTF8Loader.prototype.createModel = function(a, b, c, d, f, g) {
    var e = function() {
            var b = this;
            b.materials = [];
            THREE.Geometry.call(this);
            var e = THREE.UTF8Loader.prototype.decompressMesh(a),
                k = [],
                j = [];
            (function(a, e, i) {
                for (var j, k, q, r = a.length; i < r; i += e) j = a[i], k = a[i + 1], q = a[i + 2], j = j / 16383 * c, k = k / 16383 * c, q = q / 16383 * c, j += d, k += f, q += g, b.vertices.push(new THREE.Vertex(new THREE.Vector3(j, k, q)))
            })(e[0], 8, 0);
            (function(a, b, c) {
                for (var d, e, f = a.length; c < f; c += b) d = a[c], e = a[c + 1], d /= 1023, e /= 1023, j.push(d, 1 - e)
            })(e[0], 8, 3);
            (function(a, b, c) {
                for (var d, e, f, g = a.length; c < g; c += b) d = a[c], e = a[c + 1], f = a[c + 2], d = (d - 512) / 511, e = (e - 512) / 511, f = (f - 512) / 511, k.push(d, e, f)
            })(e[0], 8, 5);
            (function(a) {
                var c, d, e, f, g, i, s, t, v, u = a.length;
                for (c = 0; c < u; c += 3) {
                    d = a[c];
                    e = a[c + 1];
                    f = a[c + 2];
                    g = b;
                    t = d;
                    v = e;
                    i = f;
                    var w = k[3 * e],
                        z = k[3 * e + 1],
                        x = k[3 * e + 2],
                        A = k[3 * f],
                        F = k[3 * f + 1],
                        E = k[3 * f + 2];
                    s = new THREE.Vector3(k[3 * d], k[3 * d + 1], k[3 * d + 2]);
                    w = new THREE.Vector3(w, z, x);
                    A = new THREE.Vector3(A, F, E);
                    g.faces.push(new THREE.Face3(t, v, i, [s, w, A], null, 0));
                    g = j[2 * d];
                    d = j[2 * d + 1];
                    i = j[2 * e];
                    s = j[2 * e + 1];
                    t = j[2 * f];
                    v = j[2 * f + 1];
                    f = b.faceVertexUvs[0];
                    e = i;
                    i = s;
                    s = [];
                    s.push(new THREE.UV(g, d));
                    s.push(new THREE.UV(e, i));
                    s.push(new THREE.UV(t, v));
                    f.push(s)
                }
            })(e[1]);
            this.computeCentroids();
            this.computeFaceNormals()
        };
    e.prototype = new THREE.Geometry;
    e.prototype.constructor = e;
    b(new e)
};
THREE.MarchingCubes = function(a, b) {
    THREE.Object3D.call(this);
    this.material = b;
    this.init = function(a) {
        this.resolution = a;
        this.isolation = 80;
        this.size = a;
        this.size2 = this.size * this.size;
        this.size3 = this.size2 * this.size;
        this.halfsize = this.size / 2;
        this.delta = 2 / this.size;
        this.yd = this.size;
        this.zd = this.size2;
        this.field = new Float32Array(this.size3);
        this.normal_cache = new Float32Array(3 * this.size3);
        this.vlist = new Float32Array(36);
        this.nlist = new Float32Array(36);
        this.firstDraw = !0;
        this.maxCount = 4096;
        this.count = 0;
        this.hasNormal = this.hasPos = !1;
        this.positionArray = new Float32Array(3 * this.maxCount);
        this.normalArray = new Float32Array(3 * this.maxCount)
    };
    this.lerp = function(a, b, f) {
        return a + (b - a) * f
    };
    this.VIntX = function(a, b, f, g, e, h, i, k, j, m) {
        e = (e - j) / (m - j);
        j = this.normal_cache;
        b[g] = h + e * this.delta;
        b[g + 1] = i;
        b[g + 2] = k;
        f[g] = this.lerp(j[a], j[a + 3], e);
        f[g + 1] = this.lerp(j[a + 1], j[a + 4], e);
        f[g + 2] = this.lerp(j[a + 2], j[a + 5], e)
    };
    this.VIntY = function(a, b, f, g, e, h, i, k, j, m) {
        e = (e - j) / (m - j);
        j = this.normal_cache;
        b[g] = h;
        b[g + 1] = i + e * this.delta;
        b[g + 2] = k;
        b = a + 3 * this.yd;
        f[g] = this.lerp(j[a], j[b], e);
        f[g + 1] = this.lerp(j[a + 1], j[b + 1], e);
        f[g + 2] = this.lerp(j[a + 2], j[b + 2], e)
    };
    this.VIntZ = function(a, b, f, g, e, h, i, k, j, m) {
        e = (e - j) / (m - j);
        j = this.normal_cache;
        b[g] = h;
        b[g + 1] = i;
        b[g + 2] = k + e * this.delta;
        b = a + 3 * this.zd;
        f[g] = this.lerp(j[a], j[b], e);
        f[g + 1] = this.lerp(j[a + 1], j[b + 1], e);
        f[g + 2] = this.lerp(j[a + 2], j[b + 2], e)
    };
    this.compNorm = function(a) {
        var b = 3 * a;
        0 === this.normal_cache[b] && (this.normal_cache[b] = this.field[a - 1] - this.field[a + 1], this.normal_cache[b + 1] = this.field[a - this.yd] - this.field[a + this.yd], this.normal_cache[b + 2] = this.field[a - this.zd] - this.field[a + this.zd])
    };
    this.polygonize = function(a, b, f, g, e, h) {
        var i = g + 1,
            k = g + this.yd,
            j = g + this.zd,
            m = i + this.yd,
            p = i + this.zd,
            n = g + this.yd + this.zd,
            l = i + this.yd + this.zd,
            o = 0,
            q = this.field[g],
            r = this.field[i],
            s = this.field[k],
            t = this.field[m],
            v = this.field[j],
            u = this.field[p],
            w = this.field[n],
            z = this.field[l];
        q < e && (o |= 1);
        r < e && (o |= 2);
        s < e && (o |= 8);
        t < e && (o |= 4);
        v < e && (o |= 16);
        u < e && (o |= 32);
        w < e && (o |= 128);
        z < e && (o |= 64);
        var x = THREE.edgeTable[o];
        if (0 === x) return 0;
        var A = this.delta,
            F = a + A,
            E = b + A,
            A = f + A;
        x & 1 && (this.compNorm(g), this.compNorm(i), this.VIntX(3 * g, this.vlist, this.nlist, 0, e, a, b, f, q, r));
        x & 2 && (this.compNorm(i), this.compNorm(m), this.VIntY(3 * i, this.vlist, this.nlist, 3, e, F, b, f, r, t));
        x & 4 && (this.compNorm(k), this.compNorm(m), this.VIntX(3 * k, this.vlist, this.nlist, 6, e, a, E, f, s, t));
        x & 8 && (this.compNorm(g), this.compNorm(k), this.VIntY(3 * g, this.vlist, this.nlist, 9, e, a, b, f, q, s));
        x & 16 && (this.compNorm(j), this.compNorm(p), this.VIntX(3 * j, this.vlist, this.nlist, 12, e, a, b, A, v, u));
        x & 32 && (this.compNorm(p), this.compNorm(l), this.VIntY(3 * p, this.vlist, this.nlist, 15, e, F, b, A, u, z));
        x & 64 && (this.compNorm(n), this.compNorm(l), this.VIntX(3 * n, this.vlist, this.nlist, 18, e, a, E, A, w, z));
        x & 128 && (this.compNorm(j), this.compNorm(n), this.VIntY(3 * j, this.vlist, this.nlist, 21, e, a, b, A, v, w));
        x & 256 && (this.compNorm(g), this.compNorm(j), this.VIntZ(3 * g, this.vlist, this.nlist, 24, e, a, b, f, q, v));
        x & 512 && (this.compNorm(i), this.compNorm(p), this.VIntZ(3 * i, this.vlist, this.nlist, 27, e, F, b, f, r, u));
        x & 1024 && (this.compNorm(m), this.compNorm(l), this.VIntZ(3 * m, this.vlist, this.nlist, 30, e, F, E, f, t, z));
        x & 2048 && (this.compNorm(k), this.compNorm(n), this.VIntZ(3 * k, this.vlist, this.nlist, 33, e, a, E, f, s, w));
        o <<= 4;
        for (e = g = 0; - 1 != THREE.triTable[o + e];) a = o + e, b = a + 1, f = a + 2, this.posnormtriv(this.vlist, this.nlist, 3 * THREE.triTable[a], 3 * THREE.triTable[b], 3 * THREE.triTable[f], h), e += 3, g++;
        return g
    };
    this.posnormtriv = function(a, b, f, g, e, h) {
        var i = 3 * this.count;
        this.positionArray[i] = a[f];
        this.positionArray[i + 1] = a[f + 1];
        this.positionArray[i + 2] = a[f + 2];
        this.positionArray[i + 3] = a[g];
        this.positionArray[i + 4] = a[g + 1];
        this.positionArray[i + 5] = a[g + 2];
        this.positionArray[i + 6] = a[e];
        this.positionArray[i + 7] = a[e + 1];
        this.positionArray[i + 8] = a[e + 2];
        this.normalArray[i] = b[f];
        this.normalArray[i + 1] = b[f + 1];
        this.normalArray[i + 2] = b[f + 2];
        this.normalArray[i + 3] = b[g];
        this.normalArray[i + 4] = b[g + 1];
        this.normalArray[i + 5] = b[g + 2];
        this.normalArray[i + 6] = b[e];
        this.normalArray[i + 7] = b[e + 1];
        this.normalArray[i + 8] = b[e + 2];
        this.hasNormal = this.hasPos = !0;
        this.count += 3;
        this.count >= this.maxCount - 3 && h(this)
    };
    this.begin = function() {
        this.count = 0;
        this.hasNormal = this.hasPos = !1
    };
    this.end = function(a) {
        if (0 !== this.count) {
            for (var b = 3 * this.count; b < this.positionArray.length; b++) this.positionArray[b] = 0;
            a(this)
        }
    };
    this.addBall = function(a, b, f, g, e) {
        var h = this.size * Math.sqrt(g / e),
            i = f * this.size,
            k = b * this.size,
            j = a * this.size,
            m = Math.floor(i - h);
        1 > m && (m = 1);
        i = Math.floor(i + h);
        i > this.size - 1 && (i = this.size - 1);
        var p = Math.floor(k - h);
        1 > p && (p = 1);
        k = Math.floor(k + h);
        k > this.size - 1 && (k = this.size - 1);
        var n = Math.floor(j - h);
        1 > n && (n = 1);
        h = Math.floor(j + h);
        h > this.size - 1 && (h = this.size - 1);
        for (var l, o, q, r, s, t, v, j = m; j < i; j++) {
            q = this.size2 * j;
            s = j / this.size - f;
            t = s * s;
            for (m = p; m < k; m++) {
                o = q + this.size * m;
                l = m / this.size - b;
                v = l * l;
                for (l = n; l < h; l++) r = l / this.size - a, r = g / (1.0E-6 + r * r + v + t) - e, 0 < r && (this.field[o + l] += r)
            }
        }
    };
    this.addPlaneX = function(a, b) {
        var f, g, e, h, i, k = this.size,
            j = this.yd,
            m = this.zd,
            p = this.field,
            n = k * Math.sqrt(a / b);
        n > k && (n = k);
        for (f = 0; f < n; f++) if (g = f / k, g *= g, h = a / (1.0E-4 + g) - b, 0 < h) for (g = 0; g < k; g++) {
            i = f + g * j;
            for (e = 0; e < k; e++) p[m * e + i] += h
        }
    };
    this.addPlaneY = function(a, b) {
        var f, g, e, h, i, k, j = this.size,
            m = this.yd,
            p = this.zd,
            n = this.field,
            l = j * Math.sqrt(a / b);
        l > j && (l = j);
        for (g = 0; g < l; g++) if (f = g / j, f *= f, h = a / (1.0E-4 + f) - b, 0 < h) {
            i = g * m;
            for (f = 0; f < j; f++) {
                k = i + f;
                for (e = 0; e < j; e++) n[p * e + k] += h
            }
        }
    };
    this.addPlaneZ = function(a, b) {
        var f, g, e, h, i, k, j = this.size,
            m = this.yd,
            p = this.zd,
            n = this.field,
            l = j * Math.sqrt(a / b);
        l > j && (l = j);
        for (e = 0; e < l; e++) if (f = e / j, f *= f, h = a / (1.0E-4 + f) - b, 0 < h) {
            i = p * e;
            for (g = 0; g < j; g++) {
                k = i + g * m;
                for (f = 0; f < j; f++) n[k + f] += h
            }
        }
    };
    this.reset = function() {
        var a;
        for (a = 0; a < this.size3; a++) this.normal_cache[3 * a] = 0, this.field[a] = 0
    };
    this.render = function(a) {
        this.begin();
        var b, f, g, e, h, i, k, j, m, p = this.size - 2;
        for (e = 1; e < p; e++) {
            m = this.size2 * e;
            k = (e - this.halfsize) / this.halfsize;
            for (g = 1; g < p; g++) {
                j = m + this.size * g;
                i = (g - this.halfsize) / this.halfsize;
                for (f = 1; f < p; f++) h = (f - this.halfsize) / this.halfsize, b = j + f, this.polygonize(h, i, k, b, this.isolation, a)
            }
        }
        this.end(a)
    };
    this.generateGeometry = function() {
        var a = 0,
            b = new THREE.Geometry,
            f = [];
        this.render(function(g) {
            var e, h, i, k, j, m, p, n;
            for (e = 0; e < g.count; e++) p = 3 * e, j = p + 1, n = p + 2, h = g.positionArray[p], i = g.positionArray[j], k = g.positionArray[n], m = new THREE.Vector3(h, i, k), h = g.normalArray[p], i = g.normalArray[j], k = g.normalArray[n], p = new THREE.Vector3(h, i, k), p.normalize(), j = new THREE.Vertex(m), b.vertices.push(j), f.push(p);
            m = g.count / 3;
            for (e = 0; e < m; e++) p = 3 * (a + e), j = p + 1, n = p + 2, h = f[p], i = f[j], k = f[n], p = new THREE.Face3(p, j, n, [h, i, k]), b.faces.push(p);
            a += m;
            g.count = 0
        });
        return b
    };
    this.init(a)
};
THREE.MarchingCubes.prototype = new THREE.Object3D;
THREE.MarchingCubes.prototype.constructor = THREE.MarchingCubes;
THREE.edgeTable = new Int32Array([0, 265, 515, 778, 1030, 1295, 1541, 1804, 2060, 2309, 2575, 2822, 3082, 3331, 3593, 3840, 400, 153, 915, 666, 1430, 1183, 1941, 1692, 2460, 2197, 2975, 2710, 3482, 3219, 3993, 3728, 560, 825, 51, 314, 1590, 1855, 1077, 1340, 2620, 2869, 2111, 2358, 3642, 3891, 3129, 3376, 928, 681, 419, 170, 1958, 1711, 1445, 1196, 2988, 2725, 2479, 2214, 4010, 3747, 3497, 3232, 1120, 1385, 1635, 1898, 102, 367, 613, 876, 3180, 3429, 3695, 3942, 2154, 2403, 2665, 2912, 1520, 1273, 2035, 1786, 502, 255, 1013, 764, 3580, 3317, 4095, 3830, 2554, 2291, 3065, 2800, 1616, 1881, 1107, 1370, 598, 863, 85, 348, 3676, 3925, 3167, 3414, 2650, 2899, 2137, 2384, 1984, 1737, 1475, 1226, 966, 719, 453, 204, 4044, 3781, 3535, 3270, 3018, 2755, 2505, 2240, 2240, 2505, 2755, 3018, 3270, 3535, 3781, 4044, 204, 453, 719, 966, 1226, 1475, 1737, 1984, 2384, 2137, 2899, 2650, 3414, 3167, 3925, 3676, 348, 85, 863, 598, 1370, 1107, 1881, 1616, 2800, 3065, 2291, 2554, 3830, 4095, 3317, 3580, 764, 1013, 255, 502, 1786, 2035, 1273, 1520, 2912, 2665, 2403, 2154, 3942, 3695, 3429, 3180, 876, 613, 367, 102, 1898, 1635, 1385, 1120, 3232, 3497, 3747, 4010, 2214, 2479, 2725, 2988, 1196, 1445, 1711, 1958, 170, 419, 681, 928, 3376, 3129, 3891, 3642, 2358, 2111, 2869, 2620, 1340, 1077, 1855, 1590, 314, 51, 825, 560, 3728, 3993, 3219, 3482, 2710, 2975, 2197, 2460, 1692, 1941, 1183, 1430, 666, 915, 153, 400, 3840, 3593, 3331, 3082, 2822, 2575, 2309, 2060, 1804, 1541, 1295, 1030, 778, 515, 265, 0]);
THREE.triTable = new Int32Array([-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 1, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 8, 3, 9, 8, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 8, 3, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 9, 2, 10, 0, 2, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, 8, 3, 2, 10, 8, 10, 9, 8, -1, -1, -1, -1, -1, -1, -1, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 11, 2, 8, 11, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 9, 0, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 11, 2, 1, 9, 11, 9, 8, 11, -1, -1, -1, -1, -1, -1, -1, 3, 10, 1, 11, 10, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 10, 1, 0, 8, 10, 8, 11, 10, -1, -1, -1, -1, -1, -1, -1, 3, 9, 0, 3, 11, 9, 11, 10, 9, -1, -1, -1, -1, -1, -1, -1, 9, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 3, 0, 7, 3, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 1, 9, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 1, 9, 4, 7, 1, 7, 3, 1, -1, -1, -1, -1, -1, -1, -1, 1, 2, 10, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 4, 7, 3, 0, 4, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1, 9, 2, 10, 9, 0, 2, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, 2, 10, 9, 2, 9, 7, 2, 7, 3, 7, 9, 4, -1, -1, -1, -1, 8, 4, 7, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11, 4, 7, 11, 2, 4, 2, 0, 4, -1, -1, -1, -1, -1, -1, -1, 9, 0, 1, 8, 4, 7, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, 4, 7, 11, 9, 4, 11, 9, 11, 2, 9, 2, 1, -1, -1, -1, -1, 3, 10, 1, 3, 11, 10, 7, 8, 4, -1, -1, -1, -1, -1, -1, -1, 1, 11, 10, 1, 4, 11, 1, 0, 4, 7, 11, 4, -1, -1, -1, -1, 4, 7, 8, 9, 0, 11, 9, 11, 10, 11, 0, 3, -1, -1, -1, -1, 4, 7, 11, 4, 11, 9, 9, 11, 10, -1, -1, -1, -1, -1, -1, -1, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 9, 5, 4, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 5, 4, 1, 5, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 8, 5, 4, 8, 3, 5, 3, 1, 5, -1, -1, -1, -1, -1, -1, -1, 1, 2, 10, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 0, 8, 1, 2, 10, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1, 5, 2, 10, 5, 4, 2, 4, 0, 2, -1, -1, -1, -1, -1, -1, -1, 2, 10, 5, 3, 2, 5, 3, 5, 4, 3, 4, 8, -1, -1, -1, -1, 9, 5, 4, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 11, 2, 0, 8, 11, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1, 0, 5, 4, 0, 1, 5, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, 2, 1, 5, 2, 5, 8, 2, 8, 11, 4, 8, 5, -1, -1, -1, -1, 10, 3, 11, 10, 1, 3, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1, 4, 9, 5, 0, 8, 1, 8, 10, 1, 8, 11, 10, -1, -1, -1, -1, 5, 4, 0, 5, 0, 11, 5, 11, 10, 11, 0, 3, -1, -1, -1, -1, 5, 4, 8, 5, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1, 9, 7, 8, 5, 7, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 9, 3, 0, 9, 5, 3, 5, 7, 3, -1, -1, -1, -1, -1, -1, -1, 0, 7, 8, 0, 1, 7, 1, 5, 7, -1, -1, -1, -1, -1, -1, -1, 1, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 9, 7, 8, 9, 5, 7, 10, 1, 2, -1, -1, -1, -1, -1, -1, -1, 10, 1, 2, 9, 5, 0, 5, 3, 0, 5, 7, 3, -1, -1, -1, -1, 8, 0, 2, 8, 2, 5, 8, 5, 7, 10, 5, 2, -1, -1, -1, -1, 2, 10, 5, 2, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1, 7, 9, 5, 7, 8, 9, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1, 9, 5, 7, 9, 7, 2, 9, 2, 0, 2, 7, 11, -1, -1, -1, -1, 2, 3, 11, 0, 1, 8, 1, 7, 8, 1, 5, 7, -1, -1, -1, -1, 11, 2, 1, 11, 1, 7, 7, 1, 5, -1, -1, -1, -1, -1, -1, -1, 9, 5, 8, 8, 5, 7, 10, 1, 3, 10, 3, 11, -1, -1, -1, -1, 5, 7, 0, 5, 0, 9, 7, 11, 0, 1, 0, 10, 11, 10, 0, -1, 11, 10, 0, 11, 0, 3, 10, 5, 0, 8, 0, 7, 5, 7, 0, -1, 11, 10, 5, 7, 11, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 8, 3, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 9, 0, 1, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 8, 3, 1, 9, 8, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, 1, 6, 5, 2, 6, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 6, 5, 1, 2, 6, 3, 0, 8, -1, -1, -1, -1, -1, -1, -1, 9, 6, 5, 9, 0, 6, 0, 2, 6, -1, -1, -1, -1, -1, -1, -1, 5, 9, 8, 5, 8, 2, 5, 2, 6, 3, 2, 8, -1, -1, -1, -1, 2, 3, 11, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11, 0, 8, 11, 2, 0, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1, 0, 1, 9, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, 5, 10, 6, 1, 9, 2, 9, 11, 2, 9, 8, 11, -1, -1, -1, -1, 6, 3, 11, 6, 5, 3, 5, 1, 3, -1, -1, -1, -1, -1, -1, -1, 0, 8, 11, 0, 11, 5, 0, 5, 1, 5, 11, 6, -1, -1, -1, -1, 3, 11, 6, 0, 3, 6, 0, 6, 5, 0, 5, 9, -1, -1, -1, -1, 6, 5, 9, 6, 9, 11, 11, 9, 8, -1, -1, -1, -1, -1, -1, -1, 5, 10, 6, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 3, 0, 4, 7, 3, 6, 5, 10, -1, -1, -1, -1, -1, -1, -1, 1, 9, 0, 5, 10, 6, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, 10, 6, 5, 1, 9, 7, 1, 7, 3, 7, 9, 4, -1, -1, -1, -1, 6, 1, 2, 6, 5, 1, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1, 1, 2, 5, 5, 2, 6, 3, 0, 4, 3, 4, 7, -1, -1, -1, -1, 8, 4, 7, 9, 0, 5, 0, 6, 5, 0, 2, 6, -1, -1, -1, -1, 7, 3, 9, 7, 9, 4, 3, 2, 9, 5, 9, 6, 2, 6, 9, -1, 3, 11, 2, 7, 8, 4, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1, 5, 10, 6, 4, 7, 2, 4, 2, 0, 2, 7, 11, -1, -1, -1, -1, 0, 1, 9, 4, 7, 8, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1, 9, 2, 1, 9, 11, 2, 9, 4, 11, 7, 11, 4, 5, 10, 6, -1, 8, 4, 7, 3, 11, 5, 3, 5, 1, 5, 11, 6, -1, -1, -1, -1, 5, 1, 11, 5, 11, 6, 1, 0, 11, 7, 11, 4, 0, 4, 11, -1, 0, 5, 9, 0, 6, 5, 0, 3, 6, 11, 6, 3, 8, 4, 7, -1, 6, 5, 9, 6, 9, 11, 4, 7, 9, 7, 11, 9, -1, -1, -1, -1, 10, 4, 9, 6, 4, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 10, 6, 4, 9, 10, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1, 10, 0, 1, 10, 6, 0, 6, 4, 0, -1, -1, -1, -1, -1, -1, -1, 8, 3, 1, 8, 1, 6, 8, 6, 4, 6, 1, 10, -1, -1, -1, -1, 1, 4, 9, 1, 2, 4, 2, 6, 4, -1, -1, -1, -1, -1, -1, -1, 3, 0, 8, 1, 2, 9, 2, 4, 9, 2, 6, 4, -1, -1, -1, -1, 0, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 8, 3, 2, 8, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1, 10, 4, 9, 10, 6, 4, 11, 2, 3, -1, -1, -1, -1, -1, -1, -1, 0, 8, 2, 2, 8, 11, 4, 9, 10, 4, 10, 6, -1, -1, -1, -1, 3, 11, 2, 0, 1, 6, 0, 6, 4, 6, 1, 10, -1, -1, -1, -1, 6, 4, 1, 6, 1, 10, 4, 8, 1, 2, 1, 11, 8, 11, 1, -1, 9, 6, 4, 9, 3, 6, 9, 1, 3, 11, 6, 3, -1, -1, -1, -1, 8, 11, 1, 8, 1, 0, 11, 6, 1, 9, 1, 4, 6, 4, 1, -1, 3, 11, 6, 3, 6, 0, 0, 6, 4, -1, -1, -1, -1, -1, -1, -1, 6, 4, 8, 11, 6, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 7, 10, 6, 7, 8, 10, 8, 9, 10, -1, -1, -1, -1, -1, -1, -1, 0, 7, 3, 0, 10, 7, 0, 9, 10, 6, 7, 10, -1, -1, -1, -1, 10, 6, 7, 1, 10, 7, 1, 7, 8, 1, 8, 0, -1, -1, -1, -1, 10, 6, 7, 10, 7, 1, 1, 7, 3, -1, -1, -1, -1, -1, -1, -1, 1, 2, 6, 1, 6, 8, 1, 8, 9, 8, 6, 7, -1, -1, -1, -1, 2, 6, 9, 2, 9, 1, 6, 7, 9, 0, 9, 3, 7, 3, 9, -1, 7, 8, 0, 7, 0, 6, 6, 0, 2, -1, -1, -1, -1, -1, -1, -1, 7, 3, 2, 6, 7, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, 3, 11, 10, 6, 8, 10, 8, 9, 8, 6, 7, -1, -1, -1, -1, 2, 0, 7, 2, 7, 11, 0, 9, 7, 6, 7, 10, 9, 10, 7, -1, 1, 8, 0, 1, 7, 8, 1, 10, 7, 6, 7, 10, 2, 3, 11, -1, 11, 2, 1, 11, 1, 7, 10, 6, 1, 6, 7, 1, -1, -1, -1, -1, 8, 9, 6, 8, 6, 7, 9, 1, 6, 11, 6, 3, 1, 3, 6, -1, 0, 9, 1, 11, 6, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 7, 8, 0, 7, 0, 6, 3, 11, 0, 11, 6, 0, -1, -1, -1, -1, 7, 11, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 0, 8, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 1, 9, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 8, 1, 9, 8, 3, 1, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, 10, 1, 2, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 2, 10, 3, 0, 8, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1, 2, 9, 0, 2, 10, 9, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1, 6, 11, 7, 2, 10, 3, 10, 8, 3, 10, 9, 8, -1, -1, -1, -1, 7, 2, 3, 6, 2, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 7, 0, 8, 7, 6, 0, 6, 2, 0, -1, -1, -1, -1, -1, -1, -1, 2, 7, 6, 2, 3, 7, 0, 1, 9, -1, -1, -1, -1, -1, -1, -1, 1, 6, 2, 1, 8, 6, 1, 9, 8, 8, 7, 6, -1, -1, -1, -1, 10, 7, 6, 10, 1, 7, 1, 3, 7, -1, -1, -1, -1, -1, -1, -1, 10, 7, 6, 1, 7, 10, 1, 8, 7, 1, 0, 8, -1, -1, -1, -1, 0, 3, 7, 0, 7, 10, 0, 10, 9, 6, 10, 7, -1, -1, -1, -1, 7, 6, 10, 7, 10, 8, 8, 10, 9, -1, -1, -1, -1, -1, -1, -1, 6, 8, 4, 11, 8, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 6, 11, 3, 0, 6, 0, 4, 6, -1, -1, -1, -1, -1, -1, -1, 8, 6, 11, 8, 4, 6, 9, 0, 1, -1, -1, -1, -1, -1, -1, -1, 9, 4, 6, 9, 6, 3, 9, 3, 1, 11, 3, 6, -1, -1, -1, -1, 6, 8, 4, 6, 11, 8, 2, 10, 1, -1, -1, -1, -1, -1, -1, -1, 1, 2, 10, 3, 0, 11, 0, 6, 11, 0, 4, 6, -1, -1, -1, -1, 4, 11, 8, 4, 6, 11, 0, 2, 9, 2, 10, 9, -1, -1, -1, -1, 10, 9, 3, 10, 3, 2, 9, 4, 3, 11, 3, 6, 4, 6, 3, -1, 8, 2, 3, 8, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1, 0, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 9, 0, 2, 3, 4, 2, 4, 6, 4, 3, 8, -1, -1, -1, -1, 1, 9, 4, 1, 4, 2, 2, 4, 6, -1, -1, -1, -1, -1, -1, -1, 8, 1, 3, 8, 6, 1, 8, 4, 6, 6, 10, 1, -1, -1, -1, -1, 10, 1, 0, 10, 0, 6, 6, 0, 4, -1, -1, -1, -1, -1, -1, -1, 4, 6, 3, 4, 3, 8, 6, 10, 3, 0, 3, 9, 10, 9, 3, -1, 10, 9, 4, 6, 10, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 9, 5, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 8, 3, 4, 9, 5, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, 5, 0, 1, 5, 4, 0, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, 11, 7, 6, 8, 3, 4, 3, 5, 4, 3, 1, 5, -1, -1, -1, -1, 9, 5, 4, 10, 1, 2, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, 6, 11, 7, 1, 2, 10, 0, 8, 3, 4, 9, 5, -1, -1, -1, -1, 7, 6, 11, 5, 4, 10, 4, 2, 10, 4, 0, 2, -1, -1, -1, -1, 3, 4, 8, 3, 5, 4, 3, 2, 5, 10, 5, 2, 11, 7, 6, -1, 7, 2, 3, 7, 6, 2, 5, 4, 9, -1, -1, -1, -1, -1, -1, -1, 9, 5, 4, 0, 8, 6, 0, 6, 2, 6, 8, 7, -1, -1, -1, -1, 3, 6, 2, 3, 7, 6, 1, 5, 0, 5, 4, 0, -1, -1, -1, -1, 6, 2, 8, 6, 8, 7, 2, 1, 8, 4, 8, 5, 1, 5, 8, -1, 9, 5, 4, 10, 1, 6, 1, 7, 6, 1, 3, 7, -1, -1, -1, -1, 1, 6, 10, 1, 7, 6, 1, 0, 7, 8, 7, 0, 9, 5, 4, -1, 4, 0, 10, 4, 10, 5, 0, 3, 10, 6, 10, 7, 3, 7, 10, -1, 7, 6, 10, 7, 10, 8, 5, 4, 10, 4, 8, 10, -1, -1, -1, -1, 6, 9, 5, 6, 11, 9, 11, 8, 9, -1, -1, -1, -1, -1, -1, -1, 3, 6, 11, 0, 6, 3, 0, 5, 6, 0, 9, 5, -1, -1, -1, -1, 0, 11, 8, 0, 5, 11, 0, 1, 5, 5, 6, 11, -1, -1, -1, -1, 6, 11, 3, 6, 3, 5, 5, 3, 1, -1, -1, -1, -1, -1, -1, -1, 1, 2, 10, 9, 5, 11, 9, 11, 8, 11, 5, 6, -1, -1, -1, -1, 0, 11, 3, 0, 6, 11, 0, 9, 6, 5, 6, 9, 1, 2, 10, -1, 11, 8, 5, 11, 5, 6, 8, 0, 5, 10, 5, 2, 0, 2, 5, -1, 6, 11, 3, 6, 3, 5, 2, 10, 3, 10, 5, 3, -1, -1, -1, -1, 5, 8, 9, 5, 2, 8, 5, 6, 2, 3, 8, 2, -1, -1, -1, -1, 9, 5, 6, 9, 6, 0, 0, 6, 2, -1, -1, -1, -1, -1, -1, -1, 1, 5, 8, 1, 8, 0, 5, 6, 8, 3, 8, 2, 6, 2, 8, -1, 1, 5, 6, 2, 1, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 3, 6, 1, 6, 10, 3, 8, 6, 5, 6, 9, 8, 9, 6, -1, 10, 1, 0, 10, 0, 6, 9, 5, 0, 5, 6, 0, -1, -1, -1, -1, 0, 3, 8, 5, 6, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 10, 5, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11, 5, 10, 7, 5, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11, 5, 10, 11, 7, 5, 8, 3, 0, -1, -1, -1, -1, -1, -1, -1, 5, 11, 7, 5, 10, 11, 1, 9, 0, -1, -1, -1, -1, -1, -1, -1, 10, 7, 5, 10, 11, 7, 9, 8, 1, 8, 3, 1, -1, -1, -1, -1, 11, 1, 2, 11, 7, 1, 7, 5, 1, -1, -1, -1, -1, -1, -1, -1, 0, 8, 3, 1, 2, 7, 1, 7, 5, 7, 2, 11, -1, -1, -1, -1, 9, 7, 5, 9, 2, 7, 9, 0, 2, 2, 11, 7, -1, -1, -1, -1, 7, 5, 2, 7, 2, 11, 5, 9, 2, 3, 2, 8, 9, 8, 2, -1, 2, 5, 10, 2, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1, 8, 2, 0, 8, 5, 2, 8, 7, 5, 10, 2, 5, -1, -1, -1, -1, 9, 0, 1, 5, 10, 3, 5, 3, 7, 3, 10, 2, -1, -1, -1, -1, 9, 8, 2, 9, 2, 1, 8, 7, 2, 10, 2, 5, 7, 5, 2, -1, 1, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 8, 7, 0, 7, 1, 1, 7, 5, -1, -1, -1, -1, -1, -1, -1, 9, 0, 3, 9, 3, 5, 5, 3, 7, -1, -1, -1, -1, -1, -1, -1, 9, 8, 7, 5, 9, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 5, 8, 4, 5, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, -1, 5, 0, 4, 5, 11, 0, 5, 10, 11, 11, 3, 0, -1, -1, -1, -1, 0, 1, 9, 8, 4, 10, 8, 10, 11, 10, 4, 5, -1, -1, -1, -1, 10, 11, 4, 10, 4, 5, 11, 3, 4, 9, 4, 1, 3, 1, 4, -1, 2, 5, 1, 2, 8, 5, 2, 11, 8, 4, 5, 8, -1, -1, -1, -1, 0, 4, 11, 0, 11, 3, 4, 5, 11, 2, 11, 1, 5, 1, 11, -1, 0, 2, 5, 0, 5, 9, 2, 11, 5, 4, 5, 8, 11, 8, 5, -1, 9, 4, 5, 2, 11, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, 5, 10, 3, 5, 2, 3, 4, 5, 3, 8, 4, -1, -1, -1, -1, 5, 10, 2, 5, 2, 4, 4, 2, 0, -1, -1, -1, -1, -1, -1, -1, 3, 10, 2, 3, 5, 10, 3, 8, 5, 4, 5, 8, 0, 1, 9, -1, 5, 10, 2, 5, 2, 4, 1, 9, 2, 9, 4, 2, -1, -1, -1, -1, 8, 4, 5, 8, 5, 3, 3, 5, 1, -1, -1, -1, -1, -1, -1, -1, 0, 4, 5, 1, 0, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 8, 4, 5, 8, 5, 3, 9, 0, 5, 0, 3, 5, -1, -1, -1, -1, 9, 4, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 11, 7, 4, 9, 11, 9, 10, 11, -1, -1, -1, -1, -1, -1, -1, 0, 8, 3, 4, 9, 7, 9, 11, 7, 9, 10, 11, -1, -1, -1, -1, 1, 10, 11, 1, 11, 4, 1, 4, 0, 7, 4, 11, -1, -1, -1, -1, 3, 1, 4, 3, 4, 8, 1, 10, 4, 7, 4, 11, 10, 11, 4, -1, 4, 11, 7, 9, 11, 4, 9, 2, 11, 9, 1, 2, -1, -1, -1, -1, 9, 7, 4, 9, 11, 7, 9, 1, 11, 2, 11, 1, 0, 8, 3, -1, 11, 7, 4, 11, 4, 2, 2, 4, 0, -1, -1, -1, -1, -1, -1, -1, 11, 7, 4, 11, 4, 2, 8, 3, 4, 3, 2, 4, -1, -1, -1, -1, 2, 9, 10, 2, 7, 9, 2, 3, 7, 7, 4, 9, -1, -1, -1, -1, 9, 10, 7, 9, 7, 4, 10, 2, 7, 8, 7, 0, 2, 0, 7, -1, 3, 7, 10, 3, 10, 2, 7, 4, 10, 1, 10, 0, 4, 0, 10, -1, 1, 10, 2, 8, 7, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 9, 1, 4, 1, 7, 7, 1, 3, -1, -1, -1, -1, -1, -1, -1, 4, 9, 1, 4, 1, 7, 0, 8, 1, 8, 7, 1, -1, -1, -1, -1, 4, 0, 3, 7, 4, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, 8, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 9, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 0, 9, 3, 9, 11, 11, 9, 10, -1, -1, -1, -1, -1, -1, -1, 0, 1, 10, 0, 10, 8, 8, 10, 11, -1, -1, -1, -1, -1, -1, -1, 3, 1, 10, 11, 3, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 2, 11, 1, 11, 9, 9, 11, 8, -1, -1, -1, -1, -1, -1, -1, 3, 0, 9, 3, 9, 11, 1, 2, 9, 2, 11, 9, -1, -1, -1, -1, 0, 2, 11, 8, 0, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 2, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, 3, 8, 2, 8, 10, 10, 8, 9, -1, -1, -1, -1, -1, -1, -1, 9, 10, 2, 0, 9, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, 3, 8, 2, 8, 10, 0, 1, 8, 1, 10, 8, -1, -1, -1, -1, 1, 10, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 3, 8, 9, 1, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 9, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 3, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]);
THREE.LensFlare = function(a, b, c, d, f) {
    THREE.Object3D.call(this);
    this.lensFlares = [];
    this.positionScreen = new THREE.Vector3;
    this.customUpdateCallback = void 0;
    void 0 !== a && this.add(a, b, c, d, f)
};
THREE.LensFlare.prototype = new THREE.Object3D;
THREE.LensFlare.prototype.constructor = THREE.LensFlare;
THREE.LensFlare.prototype.supr = THREE.Object3D.prototype;
THREE.LensFlare.prototype.add = function(a, b, c, d, f, g) {
    void 0 === b && (b = -1);
    void 0 === c && (c = 0);
    void 0 === g && (g = 1);
    void 0 === f && (f = new THREE.Color(16777215));
    if (void 0 === d) d = THREE.NormalBlending;
    c = Math.min(c, Math.max(0, c));
    this.lensFlares.push({
        texture: a,
        size: b,
        distance: c,
        x: 0,
        y: 0,
        z: 0,
        scale: 1,
        rotation: 1,
        opacity: g,
        color: f,
        blending: d
    })
};
THREE.LensFlare.prototype.updateLensFlares = function() {
    var a, b = this.lensFlares.length,
        c, d = 2 * -this.positionScreen.x,
        f = 2 * -this.positionScreen.y;
    for (a = 0; a < b; a++) c = this.lensFlares[a], c.x = this.positionScreen.x + d * c.distance, c.y = this.positionScreen.y + f * c.distance, c.wantedRotation = 0.25 * c.x * Math.PI, c.rotation += 0.25 * (c.wantedRotation - c.rotation)
};
THREE.LensFlarePlugin = function() {
    function a(a) {
        var c = b.createProgram(),
            d = b.createShader(b.FRAGMENT_SHADER),
            e = b.createShader(b.VERTEX_SHADER);
        b.shaderSource(d, a.fragmentShader);
        b.shaderSource(e, a.vertexShader);
        b.compileShader(d);
        b.compileShader(e);
        b.attachShader(c, d);
        b.attachShader(c, e);
        b.linkProgram(c);
        return c
    }
    var b, c, d, f, g, e, h, i, k, j, m, p, n;
    this.init = function(l) {
        b = l.context;
        c = l;
        d = new Float32Array(16);
        f = new Uint16Array(6);
        l = 0;
        d[l++] = -1;
        d[l++] = -1;
        d[l++] = 0;
        d[l++] = 0;
        d[l++] = 1;
        d[l++] = -1;
        d[l++] = 1;
        d[l++] = 0;
        d[l++] = 1;
        d[l++] = 1;
        d[l++] = 1;
        d[l++] = 1;
        d[l++] = -1;
        d[l++] = 1;
        d[l++] = 0;
        d[l++] = 1;
        l = 0;
        f[l++] = 0;
        f[l++] = 1;
        f[l++] = 2;
        f[l++] = 0;
        f[l++] = 2;
        f[l++] = 3;
        g = b.createBuffer();
        e = b.createBuffer();
        b.bindBuffer(b.ARRAY_BUFFER, g);
        b.bufferData(b.ARRAY_BUFFER, d, b.STATIC_DRAW);
        b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, e);
        b.bufferData(b.ELEMENT_ARRAY_BUFFER, f, b.STATIC_DRAW);
        h = b.createTexture();
        i = b.createTexture();
        b.bindTexture(b.TEXTURE_2D, h);
        b.texImage2D(b.TEXTURE_2D, 0, b.RGB, 16, 16, 0, b.RGB, b.UNSIGNED_BYTE, null);
        b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_S, b.CLAMP_TO_EDGE);
        b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_T, b.CLAMP_TO_EDGE);
        b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MAG_FILTER, b.NEAREST);
        b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MIN_FILTER, b.NEAREST);
        b.bindTexture(b.TEXTURE_2D, i);
        b.texImage2D(b.TEXTURE_2D, 0, b.RGBA, 16, 16, 0, b.RGBA, b.UNSIGNED_BYTE, null);
        b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_S, b.CLAMP_TO_EDGE);
        b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_T, b.CLAMP_TO_EDGE);
        b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MAG_FILTER, b.NEAREST);
        b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MIN_FILTER, b.NEAREST);
        0 >= b.getParameter(b.MAX_VERTEX_TEXTURE_IMAGE_UNITS) ? (k = !1, j = a(THREE.ShaderFlares.lensFlare)) : (k = !0, j = a(THREE.ShaderFlares.lensFlareVertexTexture));
        m = {};
        p = {};
        m.vertex = b.getAttribLocation(j, "position");
        m.uv = b.getAttribLocation(j, "uv");
        p.renderType = b.getUniformLocation(j, "renderType");
        p.map = b.getUniformLocation(j, "map");
        p.occlusionMap = b.getUniformLocation(j, "occlusionMap");
        p.opacity = b.getUniformLocation(j, "opacity");
        p.color = b.getUniformLocation(j, "color");
        p.scale = b.getUniformLocation(j, "scale");
        p.rotation = b.getUniformLocation(j, "rotation");
        p.screenPosition = b.getUniformLocation(j, "screenPosition");
        n = !1
    };
    this.render = function(a, d, f, r) {
        var a = a.__webglFlares,
            s = a.length;
        if (s) {
            var t = new THREE.Vector3,
                v = r / f,
                u = 0.5 * f,
                w = 0.5 * r,
                z = 16 / r,
                x = new THREE.Vector2(z * v, z),
                A = new THREE.Vector3(1, 1, 0),
                F = new THREE.Vector2(1, 1),
                E = p,
                z = m;
            b.useProgram(j);
            n || (b.enableVertexAttribArray(m.vertex), b.enableVertexAttribArray(m.uv), n = !0);
            b.uniform1i(E.occlusionMap, 0);
            b.uniform1i(E.map, 1);
            b.bindBuffer(b.ARRAY_BUFFER, g);
            b.vertexAttribPointer(z.vertex, 2, b.FLOAT, !1, 16, 0);
            b.vertexAttribPointer(z.uv, 2, b.FLOAT, !1, 16, 8);
            b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, e);
            b.disable(b.CULL_FACE);
            b.depthMask(!1);
            var I, J, B, G, D;
            for (I = 0; I < s; I++) if (z = 16 / r, x.set(z * v, z), G = a[I], t.set(G.matrixWorld.n14, G.matrixWorld.n24, G.matrixWorld.n34), d.matrixWorldInverse.multiplyVector3(t), d.projectionMatrix.multiplyVector3(t), A.copy(t), F.x = A.x * u + u, F.y = A.y * w + w, k || 0 < F.x && F.x < f && 0 < F.y && F.y < r) {
                b.activeTexture(b.TEXTURE1);
                b.bindTexture(b.TEXTURE_2D, h);
                b.copyTexImage2D(b.TEXTURE_2D, 0, b.RGB, F.x - 8, F.y - 8, 16, 16, 0);
                b.uniform1i(E.renderType, 0);
                b.uniform2f(E.scale, x.x, x.y);
                b.uniform3f(E.screenPosition, A.x, A.y, A.z);
                b.disable(b.BLEND);
                b.enable(b.DEPTH_TEST);
                b.drawElements(b.TRIANGLES, 6, b.UNSIGNED_SHORT, 0);
                b.activeTexture(b.TEXTURE0);
                b.bindTexture(b.TEXTURE_2D, i);
                b.copyTexImage2D(b.TEXTURE_2D, 0, b.RGBA, F.x - 8, F.y - 8, 16, 16, 0);
                b.uniform1i(E.renderType, 1);
                b.disable(b.DEPTH_TEST);
                b.activeTexture(b.TEXTURE1);
                b.bindTexture(b.TEXTURE_2D, h);
                b.drawElements(b.TRIANGLES, 6, b.UNSIGNED_SHORT, 0);
                G.positionScreen.copy(A);
                G.customUpdateCallback ? G.customUpdateCallback(G) : G.updateLensFlares();
                b.uniform1i(E.renderType, 2);
                b.enable(b.BLEND);
                for (J = 0, B = G.lensFlares.length; J < B; J++) if (D = G.lensFlares[J], 0.001 < D.opacity && 0.001 < D.scale) A.x = D.x, A.y = D.y, A.z = D.z, z = D.size * D.scale / r, x.x = z * v, x.y = z, b.uniform3f(E.screenPosition, A.x, A.y, A.z), b.uniform2f(E.scale, x.x, x.y), b.uniform1f(E.rotation, D.rotation), b.uniform1f(E.opacity, D.opacity), b.uniform3f(E.color, D.color.r, D.color.g, D.color.b), c.setBlending(D.blending), c.setTexture(D.texture, 1), b.drawElements(b.TRIANGLES, 6, b.UNSIGNED_SHORT, 0)
            }
            b.enable(b.CULL_FACE);
            b.enable(b.DEPTH_TEST);
            b.depthMask(!0)
        }
    }
};
THREE.ShadowMapPlugin = function() {
    var a, b, c, d, f = new THREE.Frustum,
        g = new THREE.Matrix4;
    this.init = function(e) {
        a = e.context;
        b = e;
        var e = THREE.ShaderLib.depthRGBA,
            f = THREE.UniformsUtils.clone(e.uniforms);
        c = new THREE.ShaderMaterial({
            fragmentShader: e.fragmentShader,
            vertexShader: e.vertexShader,
            uniforms: f
        });
        d = new THREE.ShaderMaterial({
            fragmentShader: e.fragmentShader,
            vertexShader: e.vertexShader,
            uniforms: f,
            morphTargets: !0
        });
        c._shadowPass = !0;
        d._shadowPass = !0
    };
    this.render = function(a, c) {
        b.shadowMapEnabled && b.shadowMapAutoUpdate && this.update(a, c)
    };
    this.update = function(e) {
        var h, i, k, j, m, p, n, l, o, q = e.lights;
        a.clearColor(1, 1, 1, 1);
        a.disable(a.BLEND);
        b.shadowMapCullFrontFaces && a.cullFace(a.FRONT);
        b.setDepthTest(!0);
        for (h = 0, i = q.length; h < i; h++) if (l = q[h], l.castShadow) {
            if (!l.shadowMap) l.shadowMap = new THREE.WebGLRenderTarget(l.shadowMapWidth, l.shadowMapHeight, {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat
            }), l.shadowMapSize = new THREE.Vector2(l.shadowMapWidth, l.shadowMapHeight), l.shadowMatrix = new THREE.Matrix4;
            if (!l.shadowCamera) {
                if (l instanceof THREE.SpotLight) l.shadowCamera = new THREE.PerspectiveCamera(l.shadowCameraFov, l.shadowMapWidth / l.shadowMapHeight, l.shadowCameraNear, l.shadowCameraFar);
                else if (l instanceof THREE.DirectionalLight) l.shadowCamera = new THREE.OrthographicCamera(l.shadowCameraLeft, l.shadowCameraRight, l.shadowCameraTop, l.shadowCameraBottom, l.shadowCameraNear, l.shadowCameraFar);
                else {
                    console.error("Unsupported light type for shadow");
                    continue
                }
                e.add(l.shadowCamera);
                b.autoUpdateScene && e.updateMatrixWorld()
            }
            if (l.shadowCameraVisible && !l.cameraHelper) l.cameraHelper = new THREE.CameraHelper(l.shadowCamera), l.shadowCamera.add(l.cameraHelper);
            k = l.shadowMap;
            j = l.shadowMatrix;
            m = l.shadowCamera;
            m.position.copy(l.matrixWorld.getPosition());
            m.lookAt(l.target.matrixWorld.getPosition());
            m.updateMatrixWorld();
            m.matrixWorldInverse.getInverse(m.matrixWorld);
            if (l.cameraHelper) l.cameraHelper.lines.visible = l.shadowCameraVisible;
            l.shadowCameraVisible && l.cameraHelper.update(l.shadowCamera);
            j.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
            j.multiplySelf(m.projectionMatrix);
            j.multiplySelf(m.matrixWorldInverse);
            if (!m._viewMatrixArray) m._viewMatrixArray = new Float32Array(16);
            m.matrixWorldInverse.flattenToArray(m._viewMatrixArray);
            if (!m._projectionMatrixArray) m._projectionMatrixArray = new Float32Array(16);
            m.projectionMatrix.flattenToArray(m._projectionMatrixArray);
            g.multiply(m.projectionMatrix, m.matrixWorldInverse);
            f.setFromMatrix(g);
            b.setRenderTarget(k);
            b.clear();
            o = e.__webglObjects;
            for (k = 0, j = o.length; k < j; k++) if (p = o[k], l = p.object, p.render = !1, l.visible && l.castShadow && (!(l instanceof
            THREE.Mesh) || !l.frustumCulled || f.contains(l))) l.matrixWorld.flattenToArray(l._objectMatrixArray), l._modelViewMatrix.multiplyToArray(m.matrixWorldInverse, l.matrixWorld, l._modelViewMatrixArray), p.render = !0;
            for (k = 0, j = o.length; k < j; k++) if (p = o[k], p.render) l = p.object, p = p.buffer, b.setObjectFaces(l), n = l.customDepthMaterial ? l.customDepthMaterial : l.geometry.morphTargets.length ? d : c, p instanceof THREE.BufferGeometry ? b.renderBufferDirect(m, q, null, n, p, l) : b.renderBuffer(m, q, null, n, p, l);
            o = e.__webglObjectsImmediate;
            for (k = 0, j = o.length; k < j; k++) p = o[k], l = p.object, l.visible && l.castShadow && (l.matrixAutoUpdate && l.matrixWorld.flattenToArray(l._objectMatrixArray), l._modelViewMatrix.multiplyToArray(m.matrixWorldInverse, l.matrixWorld, l._modelViewMatrixArray), b.renderImmediateObject(m, q, null, c, l))
        }
        e = b.getClearColor();
        h = b.getClearAlpha();
        a.clearColor(e.r, e.g, e.b, h);
        a.enable(a.BLEND);
        b.shadowMapCullFrontFaces && a.cullFace(a.BACK)
    }
};
THREE.SpritePlugin = function() {
    function a(a, b) {
        return b.z - a.z
    }
    var b, c, d, f, g, e, h, i, k, j;
    this.init = function(a) {
        b = a.context;
        c = a;
        d = new Float32Array(16);
        f = new Uint16Array(6);
        a = 0;
        d[a++] = -1;
        d[a++] = -1;
        d[a++] = 0;
        d[a++] = 1;
        d[a++] = 1;
        d[a++] = -1;
        d[a++] = 1;
        d[a++] = 1;
        d[a++] = 1;
        d[a++] = 1;
        d[a++] = 1;
        d[a++] = 0;
        d[a++] = -1;
        d[a++] = 1;
        d[a++] = 0;
        a = d[a++] = 0;
        f[a++] = 0;
        f[a++] = 1;
        f[a++] = 2;
        f[a++] = 0;
        f[a++] = 2;
        f[a++] = 3;
        g = b.createBuffer();
        e = b.createBuffer();
        b.bindBuffer(b.ARRAY_BUFFER, g);
        b.bufferData(b.ARRAY_BUFFER, d, b.STATIC_DRAW);
        b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, e);
        b.bufferData(b.ELEMENT_ARRAY_BUFFER, f, b.STATIC_DRAW);
        var a = THREE.ShaderSprite.sprite,
            p = b.createProgram(),
            n = b.createShader(b.FRAGMENT_SHADER),
            l = b.createShader(b.VERTEX_SHADER);
        b.shaderSource(n, a.fragmentShader);
        b.shaderSource(l, a.vertexShader);
        b.compileShader(n);
        b.compileShader(l);
        b.attachShader(p, n);
        b.attachShader(p, l);
        b.linkProgram(p);
        h = p;
        i = {};
        k = {};
        i.position = b.getAttribLocation(h, "position");
        i.uv = b.getAttribLocation(h, "uv");
        k.uvOffset = b.getUniformLocation(h, "uvOffset");
        k.uvScale = b.getUniformLocation(h, "uvScale");
        k.rotation = b.getUniformLocation(h, "rotation");
        k.scale = b.getUniformLocation(h, "scale");
        k.alignment = b.getUniformLocation(h, "alignment");
        k.color = b.getUniformLocation(h, "color");
        k.map = b.getUniformLocation(h, "map");
        k.opacity = b.getUniformLocation(h, "opacity");
        k.useScreenCoordinates = b.getUniformLocation(h, "useScreenCoordinates");
        k.affectedByDistance = b.getUniformLocation(h, "affectedByDistance");
        k.screenPosition = b.getUniformLocation(h, "screenPosition");
        k.modelViewMatrix = b.getUniformLocation(h, "modelViewMatrix");
        k.projectionMatrix = b.getUniformLocation(h, "projectionMatrix");
        j = !1
    };
    this.render = function(d, f, n, l) {
        var d = d.__webglSprites,
            o = d.length;
        if (o) {
            var q = i,
                r = k,
                s = l / n,
                n = 0.5 * n,
                t = 0.5 * l,
                v = !0;
            b.useProgram(h);
            j || (b.enableVertexAttribArray(q.position), b.enableVertexAttribArray(q.uv), j = !0);
            b.disable(b.CULL_FACE);
            b.enable(b.BLEND);
            b.depthMask(!0);
            b.bindBuffer(b.ARRAY_BUFFER, g);
            b.vertexAttribPointer(q.position, 2, b.FLOAT, !1, 16, 0);
            b.vertexAttribPointer(q.uv, 2, b.FLOAT, !1, 16, 8);
            b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, e);
            b.uniformMatrix4fv(r.projectionMatrix, !1, f._projectionMatrixArray);
            b.activeTexture(b.TEXTURE0);
            b.uniform1i(r.map, 0);
            for (var u, w = [], q = 0; q < o; q++) if (u = d[q], u.visible && 0 !== u.opacity) u.useScreenCoordinates ? u.z = -u.position.z : (u._modelViewMatrix.multiplyToArray(f.matrixWorldInverse, u.matrixWorld, u._modelViewMatrixArray), u.z = -u._modelViewMatrix.n34);
            d.sort(a);
            for (q = 0; q < o; q++) u = d[q], u.visible && 0 !== u.opacity && u.map && u.map.image && u.map.image.width && (u.useScreenCoordinates ? (b.uniform1i(r.useScreenCoordinates, 1), b.uniform3f(r.screenPosition, (u.position.x - n) / n, (t - u.position.y) / t, Math.max(0, Math.min(1, u.position.z)))) : (b.uniform1i(r.useScreenCoordinates, 0), b.uniform1i(r.affectedByDistance, u.affectedByDistance ? 1 : 0), b.uniformMatrix4fv(r.modelViewMatrix, !1, u._modelViewMatrixArray)), f = u.map.image.width / (u.scaleByViewport ? l : 1), w[0] = f * s * u.scale.x, w[1] = f * u.scale.y, b.uniform2f(r.uvScale, u.uvScale.x, u.uvScale.y), b.uniform2f(r.uvOffset, u.uvOffset.x, u.uvOffset.y), b.uniform2f(r.alignment, u.alignment.x, u.alignment.y), b.uniform1f(r.opacity, u.opacity), b.uniform3f(r.color, u.color.r, u.color.g, u.color.b), b.uniform1f(r.rotation, u.rotation), b.uniform2fv(r.scale, w), u.mergeWith3D && !v ? (b.enable(b.DEPTH_TEST), v = !0) : !u.mergeWith3D && v && (b.disable(b.DEPTH_TEST), v = !1), c.setBlending(u.blending), c.setTexture(u.map, 0), b.drawElements(b.TRIANGLES, 6, b.UNSIGNED_SHORT, 0));
            b.enable(b.CULL_FACE);
            b.enable(b.DEPTH_TEST);
            b.depthMask(!0)
        }
    }
};
if (THREE.WebGLRenderer) THREE.AnaglyphWebGLRenderer = function(a) {
    THREE.WebGLRenderer.call(this, a);
    this.autoUpdateScene = !1;
    var b = this,
        c = this.setSize,
        d = this.render,
        f = new THREE.PerspectiveCamera,
        g = new THREE.PerspectiveCamera,
        e = new THREE.Matrix4,
        h = new THREE.Matrix4,
        i, k, j, m;
    f.matrixAutoUpdate = g.matrixAutoUpdate = !1;
    var a = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat
    },
        p = new THREE.WebGLRenderTarget(512, 512, a),
        n = new THREE.WebGLRenderTarget(512, 512, a),
        l = new THREE.PerspectiveCamera(53, 1, 1, 1E4);
    l.position.z = 2;
    var a = new THREE.ShaderMaterial({
        uniforms: {
            mapLeft: {
                type: "t",
                value: 0,
                texture: p
            },
            mapRight: {
                type: "t",
                value: 1,
                texture: n
            }
        },
        vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = vec2( uv.x, 1.0 - uv.y );\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
        fragmentShader: "uniform sampler2D mapLeft;\nuniform sampler2D mapRight;\nvarying vec2 vUv;\nvoid main() {\nvec4 colorL, colorR;\nvec2 uv = vUv;\ncolorL = texture2D( mapLeft, uv );\ncolorR = texture2D( mapRight, uv );\ngl_FragColor = vec4( colorL.g * 0.7 + colorL.b * 0.3, colorR.g, colorR.b, colorL.a + colorR.a ) * 1.1;\n}"
    }),
        o = new THREE.Scene;
    o.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), a));
    o.add(l);
    this.setSize = function(a, d) {
        c.call(b, a, d);
        p.width = a;
        p.height = d;
        n.width = a;
        n.height = d
    };
    this.render = function(a, c) {
        a.updateMatrixWorld();
        if (i !== c.aspect || k !== c.near || j !== c.far || m !== c.fov) {
            i = c.aspect;
            k = c.near;
            j = c.far;
            m = c.fov;
            var s = c.projectionMatrix.clone(),
                t = 0.5 * (125 / 30),
                v = t * k / 125,
                u = k * Math.tan(m * Math.PI / 360),
                w;
            e.n14 = t;
            h.n14 = -t;
            t = -u * i + v;
            w = u * i + v;
            s.n11 = 2 * k / (w - t);
            s.n13 = (w + t) / (w - t);
            f.projectionMatrix.copy(s);
            t = -u * i - v;
            w = u * i - v;
            s.n11 = 2 * k / (w - t);
            s.n13 = (w + t) / (w - t);
            g.projectionMatrix.copy(s)
        }
        f.matrixWorld.copy(c.matrixWorld).multiplySelf(h);
        f.position.copy(c.position);
        f.near = c.near;
        f.far = c.far;
        d.call(b, a, f, p, !0);
        g.matrixWorld.copy(c.matrixWorld).multiplySelf(e);
        g.position.copy(c.position);
        g.near = c.near;
        g.far = c.far;
        d.call(b, a, g, n, !0);
        o.updateMatrixWorld();
        d.call(b, o, l)
    }
};
if (THREE.WebGLRenderer) THREE.CrosseyedWebGLRenderer = function(a) {
    THREE.WebGLRenderer.call(this, a);
    this.autoClear = !1;
    var b = this,
        c = this.setSize,
        d = this.render,
        f, g, e = new THREE.PerspectiveCamera;
    e.target = new THREE.Vector3(0, 0, 0);
    var h = new THREE.PerspectiveCamera;
    h.target = new THREE.Vector3(0, 0, 0);
    b.separation = 10;
    if (a && void 0 !== a.separation) b.separation = a.separation;
    this.setSize = function(a, d) {
        c.call(b, a, d);
        f = a / 2;
        g = d
    };
    this.render = function(a, c) {
        this.clear();
        e.fov = c.fov;
        e.aspect = 0.5 * c.aspect;
        e.near = c.near;
        e.far = c.far;
        e.updateProjectionMatrix();
        e.position.copy(c.position);
        e.target.copy(c.target);
        e.translateX(b.separation);
        e.lookAt(e.target);
        h.projectionMatrix = e.projectionMatrix;
        h.position.copy(c.position);
        h.target.copy(c.target);
        h.translateX(-b.separation);
        h.lookAt(h.target);
        this.setViewport(0, 0, f, g);
        d.call(b, a, e);
        this.setViewport(f, 0, f, g);
        d.call(b, a, h, !1)
    }
};
THREE.ShaderFlares = {
    lensFlareVertexTexture: {
        vertexShader: "uniform vec3 screenPosition;\nuniform vec2 scale;\nuniform float rotation;\nuniform int renderType;\nuniform sampler2D occlusionMap;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvarying float vVisibility;\nvoid main() {\nvUV = uv;\nvec2 pos = position;\nif( renderType == 2 ) {\nvec4 visibility = texture2D( occlusionMap, vec2( 0.1, 0.1 ) ) +\ntexture2D( occlusionMap, vec2( 0.5, 0.1 ) ) +\ntexture2D( occlusionMap, vec2( 0.9, 0.1 ) ) +\ntexture2D( occlusionMap, vec2( 0.9, 0.5 ) ) +\ntexture2D( occlusionMap, vec2( 0.9, 0.9 ) ) +\ntexture2D( occlusionMap, vec2( 0.5, 0.9 ) ) +\ntexture2D( occlusionMap, vec2( 0.1, 0.9 ) ) +\ntexture2D( occlusionMap, vec2( 0.1, 0.5 ) ) +\ntexture2D( occlusionMap, vec2( 0.5, 0.5 ) );\nvVisibility = (       visibility.r / 9.0 ) *\n( 1.0 - visibility.g / 9.0 ) *\n(       visibility.b / 9.0 ) *\n( 1.0 - visibility.a / 9.0 );\npos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;\npos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;\n}\ngl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );\n}",
        fragmentShader: "precision mediump float;\nuniform sampler2D map;\nuniform float opacity;\nuniform int renderType;\nuniform vec3 color;\nvarying vec2 vUV;\nvarying float vVisibility;\nvoid main() {\nif( renderType == 0 ) {\ngl_FragColor = vec4( 1.0, 0.0, 1.0, 0.0 );\n} else if( renderType == 1 ) {\ngl_FragColor = texture2D( map, vUV );\n} else {\nvec4 texture = texture2D( map, vUV );\ntexture.a *= opacity * vVisibility;\ngl_FragColor = texture;\ngl_FragColor.rgb *= color;\n}\n}"
    },
    lensFlare: {
        vertexShader: "uniform vec3 screenPosition;\nuniform vec2 scale;\nuniform float rotation;\nuniform int renderType;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvoid main() {\nvUV = uv;\nvec2 pos = position;\nif( renderType == 2 ) {\npos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;\npos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;\n}\ngl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );\n}",
        fragmentShader: "precision mediump float;\nuniform sampler2D map;\nuniform sampler2D occlusionMap;\nuniform float opacity;\nuniform int renderType;\nuniform vec3 color;\nvarying vec2 vUV;\nvoid main() {\nif( renderType == 0 ) {\ngl_FragColor = vec4( texture2D( map, vUV ).rgb, 0.0 );\n} else if( renderType == 1 ) {\ngl_FragColor = texture2D( map, vUV );\n} else {\nfloat visibility = texture2D( occlusionMap, vec2( 0.5, 0.1 ) ).a +\ntexture2D( occlusionMap, vec2( 0.9, 0.5 ) ).a +\ntexture2D( occlusionMap, vec2( 0.5, 0.9 ) ).a +\ntexture2D( occlusionMap, vec2( 0.1, 0.5 ) ).a;\nvisibility = ( 1.0 - visibility / 4.0 );\nvec4 texture = texture2D( map, vUV );\ntexture.a *= opacity * visibility;\ngl_FragColor = texture;\ngl_FragColor.rgb *= color;\n}\n}"
    }
};
THREE.ShaderSprite = {
    sprite: {
        vertexShader: "uniform int useScreenCoordinates;\nuniform int affectedByDistance;\nuniform vec3 screenPosition;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform float rotation;\nuniform vec2 scale;\nuniform vec2 alignment;\nuniform vec2 uvOffset;\nuniform vec2 uvScale;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvoid main() {\nvUV = uvOffset + uv * uvScale;\nvec2 alignedPosition = position + alignment;\nvec2 rotatedPosition;\nrotatedPosition.x = ( cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y ) * scale.x;\nrotatedPosition.y = ( sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y ) * scale.y;\nvec4 finalPosition;\nif( useScreenCoordinates != 0 ) {\nfinalPosition = vec4( screenPosition.xy + rotatedPosition, screenPosition.z, 1.0 );\n} else {\nfinalPosition = projectionMatrix * modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );\nfinalPosition.xy += rotatedPosition * ( affectedByDistance == 1 ? 1.0 : finalPosition.z );\n}\ngl_Position = finalPosition;\n}",
        fragmentShader: "precision mediump float;\nuniform vec3 color;\nuniform sampler2D map;\nuniform float opacity;\nvarying vec2 vUV;\nvoid main() {\nvec4 texture = texture2D( map, vUV );\ngl_FragColor = vec4( color * texture.xyz, texture.a * opacity );\n}"
    }
};
