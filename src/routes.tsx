import React from 'react'
import { Navigate } from 'react-router-dom'

import { Component as HomePage } from '@/pages/Home'
import { Component as LandingPage } from '@/pages/Landing'
import { RoutesConfig } from '@/router'

const routes: RoutesConfig = {
  routes: [
    {
      path: '/',
      element: <LandingPage />,
    },
    {
      path: '/home',
      element: <HomePage />,
    },
    {
      path: '/policies',
      lazy: () => import('@/pages/Policies'),
    },
    {
      path: '/requests',
      lazy: () => import('@/pages/Requests'),
      routeOptions: {
        fullscreen: true,
        bottomSafeArea: false,
      },
    },
    {
      path: '/traffic',
      lazy: () => import('@/pages/Traffic'),
    },
    {
      path: '/modules',
      lazy: () => import('@/pages/Modules'),
    },
    {
      path: '/scripting',
      lazy: () => import('@/pages/Scripting'),
      routeOptions: {
        fullscreen: true,
      },
    },
    {
      path: '/scripting/evaluate',
      lazy: () => import('@/pages/Scripting/Evaluate'),
      routeOptions: {
        fullscreen: true,
      },
    },
    {
      path: '/dns',
      lazy: () => import('@/pages/Dns'),
      routeOptions: {
        fullscreen: true,
      },
    },
    {
      path: '/devices',
      lazy: () => import('@/pages/Devices'),
    },
    {
      path: '/profiles',
      lazy: () => import('@/pages/Profiles/Manage'),
    },
    {
      path: '/profiles/current',
      lazy: () => import('@/pages/Profiles/Current'),
      routeOptions: {
        fullscreen: true,
        bottomSafeArea: false,
      },
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ],
}

export default routes
