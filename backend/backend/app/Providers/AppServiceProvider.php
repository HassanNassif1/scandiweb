<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Interfaces\CategoryInterface;
use App\Repositories\CategoryRepository;
use App\Interfaces\ProductInterface;
use App\Repositories\ProductRepository;
use App\Interfaces\ProductImageInterface;
use App\Repositories\ProductImageRepository;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        // Bind CategoryInterface to CategoryRepository
        $this->app->bind(CategoryInterface::class, CategoryRepository::class);

        // Bind ProductInterface to ProductRepository
        $this->app->bind(ProductInterface::class, ProductRepository::class);

        // Bind ProductImageInterface to ProductImageRepository
        $this->app->bind(ProductImageInterface::class, ProductImageRepository::class);
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
