using System;
using System.ComponentModel;
using System.Linq;


namespace Common
{

    public static class ObjectExtend
    {

        public static string GetDescription(this Type type, bool inherit = false)
        {
            return type.GetCustomAttributes(typeof(DescriptionAttribute), inherit)
                .OfType<DescriptionAttribute>()
                .Select(descriptionAttribute => descriptionAttribute.Description).FirstOrDefault();
        }

    }

}