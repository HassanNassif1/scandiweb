<?php
namespace App\Providers;

use App\GraphQL\Scalars\JSON;
use Illuminate\Support\ServiceProvider;
use GraphQL\Type\Definition\Type;

class GraphQLServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        // Register custom scalar types
        Type::registerType(new JSON());
    }

    /**
     * Register bindings in the container.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
