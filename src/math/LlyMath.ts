import {Vec3} from './Vec3';
import {Matrix4x4} from './Matrix4x4';

export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export {Vec3, Matrix4x4};
