<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\ProductImageRepository; // Import the repository directly

class productimages extends Controller
{
    protected $imageRepository;

    public function __construct(ProductImageRepository $imageRepository) // Change the type hint to the concrete class
    {
        $this->imageRepository = $imageRepository;
    }

    // Fetch all images
    public function fetchImages()
    {
        // Fetch all images using the injected repository
        $images = $this->imageRepository->getAllImages();

        // Return the fetched images as JSON response
        return response()->json($images);
    }

    // Other methods related to image handling
}
