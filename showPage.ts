import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HeaderSchema } from "./HeaderSchema"; // Ton schéma défini plus haut

const AdminForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(HeaderSchema),
  });

  const onSubmit = (data) => console.log(data);

  return (  
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Méta Description</label>
        <input {...register("metaDescription")} />
        {errors.metaDescription && <span>{errors.metaDescription.message}</span>}
      </div>

      <div>
        <label>Type de page</label>
        <select {...register("pageType")}>
          <option value="article">Article</option>
          <option value="website">Site Web</option>
        </select>
      </div>

      <div>
        <label>Image</label>
        <input {...register("image")} />
      </div>

      <div>
        <label>Date de création</label>
        <input type="date" {...register("dateCrea")} />
      </div>

      <div>
        <label>Date de modification</label>
        <input type="date" {...register("dateModif")} />
      </div>

      <button type="submit">Valider</button>
    </form>
  );
};
