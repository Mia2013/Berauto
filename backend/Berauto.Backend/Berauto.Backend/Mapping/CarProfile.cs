using AutoMapper;
using Berauto.Backend.DTO;
using Berauto.Backend.Models;

namespace Berauto.Backend.Mapping;

public class CarProfile : Profile
{
    public CarProfile()
    {
        CreateMap<Car, CarDTO>()
            .ForMember(dest => dest.FuelName, opt => opt.MapFrom(src => src.Fuel != null ? src.Fuel.Name : null));

        CreateMap<CarDTO, Car>()
            .ForMember(dest => dest.Fuel, opt => opt.Ignore())
            .ForMember(dest => dest.Rentals, opt => opt.Ignore())
            .ForMember(dest => dest.Services, opt => opt.Ignore());
    }
}