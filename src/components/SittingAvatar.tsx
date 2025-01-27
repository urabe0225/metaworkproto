import { useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { VRM, VRMLoaderPlugin, VRMHumanBoneName, VRMUtils } from '@pixiv/three-vrm'
import { useControls } from 'leva'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Object3D } from 'three'

interface AvatarProps {
  position: [number, number, number]
  vrm: string
  scale?: number
  rotation?: [number, number, number]
}

const Avatar: React.FC<AvatarProps> = ({ position, vrm, scale, rotation }) => {
  const { ...controls } = useControls({
    Head: { value: 0, min: -0.4, max: 0.4 },
    leftArm: { value: 0.4, min: -0.4, max: 0.4 },
    rightArm: { value: -0.4, min: -0.4, max: 0.4 },
    RightUpperLeg: { value: 0.4, min: -0.8, max: 0.8 },
    LeftUpperLeg: { value: 0.4, min: -0.8, max: 0.8 },
    LeftLowerLeg: { value: -0.4, min: -0.8, max: 0 },
    RightLowerLeg: { value: -0.4, min: -0.8, max: 0 },
    Neutral: { value: 0, min: 0, max: 1 },
    Angry: { value: 0, min: 0, max: 1 },
    Relaxed: { value: 0, min: 0, max: 1 },
    Happy: { value: 0, min: 0, max: 1 },
    Sad: { value: 0, min: 0, max: 1 },
    Surprised: { value: 0, min: 0, max: 1 },
    Extra: { value: 0, min: 0, max: 1 }
  })
  const { scene, camera } = useThree()
  const [gltf, setGltf] = useState<GLTF>()
  const avatar = useRef<VRM>()
  const [bonesStore, setBones] = useState<{ [part: string]: Object3D }>({})

  useEffect(() => {
    if (!gltf) {
      const loader = new GLTFLoader()
      loader.register((parser: any) => {
        return new VRMLoaderPlugin(parser)
      })
      loader.load(vrm, (gltf: GLTF) => {
        setGltf(gltf)
        const vrm: VRM = gltf.userData.vrm
        VRMUtils.rotateVRM0(vrm); // vrmがVRM0の場合、vrm.sceneをY軸を中心に180度回転させる。
        avatar.current = vrm
        if (vrm.lookAt) {
          vrm.lookAt.target = camera
        }
        const bones = {
          head: vrm.humanoid.getNormalizedBoneNode(VRMHumanBoneName.Head) || new Object3D(),
          neck: vrm.humanoid.getRawBoneNode(VRMHumanBoneName.Neck) || new Object3D(),
          hips: vrm.humanoid.getRawBoneNode(VRMHumanBoneName.Hips) || new Object3D(),
          spine: vrm.humanoid.getRawBoneNode(VRMHumanBoneName.Spine) || new Object3D(),
          upperChest: vrm.humanoid.getRawBoneNode(VRMHumanBoneName.UpperChest) || new Object3D(),
          leftArm: vrm.humanoid.getNormalizedBoneNode(VRMHumanBoneName.LeftUpperArm) || new Object3D(),
          rightArm: vrm.humanoid.getNormalizedBoneNode(VRMHumanBoneName.RightUpperArm) || new Object3D(),
          RightLowerLeg: vrm.humanoid.getNormalizedBoneNode(VRMHumanBoneName.RightLowerLeg) || new Object3D(),
          LeftLowerLeg: vrm.humanoid.getNormalizedBoneNode(VRMHumanBoneName.LeftLowerLeg) || new Object3D(),
          LeftUpperLeg: vrm.humanoid.getNormalizedBoneNode(VRMHumanBoneName.LeftUpperLeg) || new Object3D(),
          RightUpperLeg: vrm.humanoid.getNormalizedBoneNode(VRMHumanBoneName.RightUpperLeg) || new Object3D()
        }
        setBones(bones)
      })
    }
  }, [scene, gltf, camera])

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime()
    if (avatar.current) {
      avatar.current.update(delta)
      const blinkDelay = 10
      const blinkFrequency = 3
      if (Math.round(t * blinkFrequency) % blinkDelay === 0 && avatar.current.expressionManager) {
        avatar.current.expressionManager.setValue('blink', 1 - Math.abs(Math.sin(t * blinkFrequency * Math.PI)))
      }
      if (avatar.current?.expressionManager) {
        avatar.current.expressionManager.setValue('neutral', controls.Neutral)
        avatar.current.expressionManager.setValue('angry', controls.Angry)
        avatar.current.expressionManager.setValue('relaxed', controls.Relaxed)
        avatar.current.expressionManager.setValue('happy', controls.Happy)
        avatar.current.expressionManager.setValue('sad', controls.Sad)
        avatar.current.expressionManager.setValue('Surprised', controls.Surprised)
        avatar.current.expressionManager.setValue('Extra', controls.Extra)
      }
    }
    if (bonesStore.neck) {
      bonesStore.neck.rotation.y = (Math.PI / 100) * Math.sin((t / 4) * Math.PI)
    }
    if (bonesStore.upperChest) {
      bonesStore.upperChest.rotation.y = (Math.PI / 600) * Math.sin((t / 8) * Math.PI)
      bonesStore.spine.position.y = (Math.PI / 400) * Math.sin((t / 2) * Math.PI)
      bonesStore.spine.position.z = (Math.PI / 600) * Math.sin((t / 2) * Math.PI)
    }
    if (bonesStore.head) {
      bonesStore.head.rotation.y = controls.Head * Math.PI
    }
    if (bonesStore.leftArm) {
      bonesStore.leftArm.rotation.z = controls.leftArm * Math.PI
    }
    if (bonesStore.rightArm) {
      bonesStore.rightArm.rotation.z = controls.rightArm * Math.PI
    }
    if (bonesStore.RightLowerLeg) {
        bonesStore.RightLowerLeg.rotation.x = controls.RightLowerLeg * Math.PI
    }
    if (bonesStore.LeftLowerLeg) {
        bonesStore.LeftLowerLeg.rotation.x = controls.LeftLowerLeg * Math.PI
    }
    if (bonesStore.RightUpperLeg) {
        bonesStore.RightUpperLeg.rotation.x = controls.RightUpperLeg * Math.PI
    }
    if (bonesStore.LeftUpperLeg) {
        bonesStore.LeftUpperLeg.rotation.x = controls.LeftUpperLeg * Math.PI
    }
  })
  return (
    <>
      {gltf ? (
        <>
        <primitive object={gltf.scene} position={position} scale={scale} rotation={rotation}/>
        </>
      ) : (
        <>
        </>
      )}
    </>
  )
}

export default Avatar
//https://codesandbox.io/p/sandbox/react-three-fiber-vrm-9ryxq?file=%2Fsrc%2Findex.tsx%3A73%2C8-73%2C14