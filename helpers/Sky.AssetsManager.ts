import globalify from 'sky/utilities/globalify'

declare global {
    namespace Sky {
        namespace AssetsManager {
            interface TextureOptions extends SkyLib.AssetsManager.TextureOptions {}
            interface LoadTextureOptions extends SkyLib.AssetsManager.LoadTextureOptions {}

            type AssetsManager = SkyLib.AssetsManager
            const AssetsManager: typeof SkyLib.AssetsManager
        }
    }
}

namespace SkyLib {
    export namespace AssetsManager {
        export interface TextureOptions {
            texture: Three.Texture
            factor?: number
            wrapX?: boolean
            wrapY?: boolean
        }
        export interface LoadTextureOptions {
            factor?: number
            wrapX?: boolean
            wrapY?: boolean
        }
    }
    export class AssetsManager {
        readonly textureLoader: Three.TextureLoader
        progress: number = 1

        constructor() {
            this.textureLoader = new Three.TextureLoader()
        }

        getTexture(name: string): Three.Texture {
            return this.__textures[name].texture
        }

        getTextureOptions(name: string): AssetsManager.TextureOptions {
            return this.__textures[name]
        }

        async loadTexture(
            name: string,
            options: AssetsManager.LoadTextureOptions = {}
        ): Promise<void | Three.Texture> {
            const { wrapX, wrapY } = options
            let { factor } = options
            factor ??= 1

            this.__loaders[`texture ${name}`] = 0
            this.__updateProgress()

            return this.textureLoader
                .loadAsync(`/images/${name}.png`, ev => {
                    this.__loaders[`texture ${name}`] = ev.loaded / ev.total
                    this.__updateProgress()
                })
                .then(texture => {
                    if (wrapX) {
                        texture.wrapS = Three.RepeatWrapping
                    }

                    if (wrapY) {
                        texture.wrapT = Three.RepeatWrapping
                    }

                    this.__loaders[`texture ${name}`] = 1
                    this.__updateProgress()
                    this.__textures[name] = { factor, wrapX, wrapY, texture }

                    return texture
                })
                .catch(error => {
                    // eslint-disable-next-line no-console
                    console.error(`Failed load texture "/images/${name}.png"`)
                    // eslint-disable-next-line no-console
                    console.error(error)
                })
        }

        private __updateProgress(): void {
            const loaderKeys = Object.keys(this.__loaders)

            if (loaderKeys.length === 0) {
                this.progress = 1
                return
            }

            this.progress = loaderKeys.reduce((prev, k) => {
                return prev + this.__loaders[k]
            }, 0)
            this.progress /= loaderKeys.length

            if (this.progress === 1) {
                this.__loaders = {}
            }
        }

        private __textures: Record<string, AssetsManager.TextureOptions> = {}
        private __loaders: Record<string, number> = {}
    }
}

globalify.namespace('Sky', SkyLib)
