import { NextConfig } from 'next'
import Webpack from 'webpack'
import { addWebpackPlugin } from './lib/addWebpackPlugin'

const getWithEnvironment = (envs: string[] | { [key: string]: string }) => (nextConfig: NextConfig) => {
  return addWebpackPlugin(nextConfig, new Webpack.EnvironmentPlugin(envs))
}

export default getWithEnvironment
