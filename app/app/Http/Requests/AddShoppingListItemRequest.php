<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddShoppingListItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ingredient_id' => 'nullable|exists:ingredients,id',
            'name' => 'required|string',
            'quantity' => 'required|numeric|min:0',
            'unit' => 'required|string',
            'is_manual' => 'boolean',
        ];
    }
}