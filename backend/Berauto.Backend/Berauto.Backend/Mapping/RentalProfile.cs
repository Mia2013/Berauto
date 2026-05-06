using AutoMapper;
using Berauto.Backend.DTO;
using Berauto.Backend.Models;

namespace Berauto.Backend.Mapping;

public class RentalProfile : Profile
{
    public RentalProfile()
    {
        CreateMap<Rental, RentalDTO>()
            .ForMember(dest => dest.CarBrand,  opt => opt.MapFrom(src => src.Car != null ? src.Car.Brand : null))
            .ForMember(dest => dest.CarModel,  opt => opt.MapFrom(src => src.Car != null ? src.Car.Model : null))
            .ForMember(dest => dest.CarRegNum, opt => opt.MapFrom(src => src.Car != null ? src.Car.RegNum : null))
            .ForMember(dest => dest.UserName,  opt => opt.MapFrom(src => src.User != null ? src.User.Name : null))
            .ForMember(dest => dest.StatusName,opt => opt.MapFrom(src => src.Status != null ? src.Status.StatusName : null));

        // For POST we only need CarId + UserId coming in, so map DTO -> Rental too
        CreateMap<RentalDTO, Rental>()
            .ForMember(dest => dest.Car,    opt => opt.Ignore())
            .ForMember(dest => dest.User,   opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.Ignore());
    }
}
