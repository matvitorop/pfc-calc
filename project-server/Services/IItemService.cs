﻿using project_server.Repositories;
using project_server.Models;

namespace project_server.Services
{
    public interface IItemService
    {
        Task<ItemCalories> AddItemAsync(ItemCalories item, Items items); //додав аргумент ще один з моделі
    }
}
