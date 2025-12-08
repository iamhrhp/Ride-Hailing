package com.gaadisathi

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost

class MainApplication : Application(), ReactApplication {

  private val _reactNativeHost: ReactNativeHost = object : DefaultReactNativeHost(this) {
    override fun getPackages(): List<com.facebook.react.ReactPackage> =
        PackageList(this@MainApplication).packages

    override val isNewArchEnabled: Boolean
      get() = com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled

    override fun getUseDeveloperSupport(): Boolean =
        com.facebook.react.BuildConfig.DEBUG
  }

  override val reactNativeHost: ReactNativeHost
    get() = _reactNativeHost

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList = PackageList(this).packages,
      jsMainModulePath = "index",
      jsBundleAssetPath = "index",
      jsBundleFilePath = null,
      isHermesEnabled = true,
      useDevSupport = com.facebook.react.BuildConfig.DEBUG,
      cxxReactPackageProviders = emptyList(),
      exceptionHandler = { throw it },
      bindingsInstaller = null
    )
  }

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
  }
}
