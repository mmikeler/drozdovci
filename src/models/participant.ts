// Participant model class
// Safe constructor with explicit property initialization

import {
  BurialPlace,
  Participant as P,
  UserRank,
} from "@/generated/prisma/client";
import { rankLabels } from "@/lib/ranks";
import { DescriptionsProps } from "antd";
import { ReactNode } from "react";

export class Participant {
  // ID
  id: number;
  // FIO
  name: string = "";
  surname: string = "";
  patronymic: string = "";

  // Voennoe
  rank: UserRank | undefined;
  division: string = "";

  // Dates
  born_at: string = "";
  died_at: string = "";

  // Drozdovski division
  isDrozdovec: boolean = false;

  // 198 division
  is198: boolean = false;

  // Was born
  guberniya: string = "";
  uezd: string = "";
  volost: string = "";
  locality: string = "";

  // Photo
  photos: string[] = [];
  grave_photo: string[] = [];

  // Another
  rewards: string = "";
  bio: string = "";
  source: string = "";
  placeOfDeath: string = "";
  status: string = "DRAFT";

  // Relations
  burialPlaceId: number | null = null;
  burialPlace: BurialPlace | null = null;

  constructor(p: P) {
    // Explicit property assignment for type safety
    this.id = p.id;

    // FIO
    this.name = p.name ?? "";
    this.surname = p.surname ?? "";
    this.patronymic = p.patronymic ?? "";

    // Voennoe
    this.rank = p.rank ?? "Ryadovoy";
    this.division = p.division ?? "";

    // Dates
    this.born_at = p.born_at ?? "";
    this.died_at = p.died_at ?? "";

    // Division flags
    this.isDrozdovec = p.isDrozdovec ?? false;
    this.is198 = p.is198 ?? false;

    // Was born
    this.guberniya = p.guberniya ?? "";
    this.uezd = p.uezd ?? "";
    this.volost = p.volost ?? "";
    this.locality = p.locality ?? "";

    // Photo
    this.photos = p.photos ? JSON.parse(p.photos) : [];
    this.grave_photo = p.grave_photo ? JSON.parse(p.grave_photo) : [];

    // Another
    this.rewards = p.rewards ?? "";
    this.bio = p.bio ?? "";
    this.source = p.source ?? "";
    this.placeOfDeath = p.placeOfDeath ?? "";
    this.status = p.status ?? "DRAFT";

    // Relations
    this.burialPlaceId = p.burialPlaceId;
  }

  // Get avatar URL from photos JSON
  get avatar(): string | undefined {
    try {
      const photos = this.photos;
      if (Array.isArray(photos) && photos.length > 0) {
        return photos[0];
      }
    } catch (e) {
      console.error("Failed to parse photos JSON:", e);
    }
    return "/mock2.jpg";
  }

  // Get grave first photo
  get gravePhoto(): string {
    return this.graveGallery[0];
  }

  // Get photos URL from photos
  get gallery(): string[] {
    return this.photos;
  }

  // Get grave photo URL from grave_photo
  get graveGallery(): string[] {
    return this.grave_photo;
  }

  // Add any additional methods here
  get fullName(): string {
    const parts = [this.surname, this.name, this.patronymic].filter(Boolean);
    return parts.join(" ");
  }

  // Get rank label
  get rankLabel(): string | undefined {
    if (this.rank && this.rank.length > 0) {
      return rankLabels[this.rank];
    }
    return "-";
  }

  // Get permalink
  get permalink(): string {
    return `/p/participants/${this.id}`;
  }

  // Check empty values
  checkEmpty = (key: string): ReactNode => {
    const value = this[key as keyof Participant];

    if (typeof value === "boolean") return String(value ? "Да" : "Нет");

    if (typeof value !== "string") return "-";

    return value || "-";
  };

  // Get descriptions items for ParticipantCard component
  get descriptionItems(): { [key: string]: DescriptionsProps["items"] } {
    return {
      fio: [
        {
          label: "Фамилия",
          key: "surname",
          children: this.checkEmpty("surname"),
          span: "filled",
        },
        {
          label: "Имя",
          key: "name",
          children: this.checkEmpty("name"),
          span: "filled",
        },
        {
          label: "Отчество",
          key: "patronymic",
          children: this.checkEmpty("patronymic"),
          span: "filled",
        },
      ],
      voenka: [
        {
          label: "Чин",
          key: "rank",
          children: this.rankLabel,
          span: "filled",
        },
        {
          label: "Воинская часть",
          key: "division",
          children: this.checkEmpty("division"),
          span: "filled",
        },
      ],
      dates: [
        {
          label: "Дата рождения",
          key: "birthDate",
          children: this.checkEmpty("born_at"),
        },
        {
          label: "Дата смерти",
          key: "deathDate",
          children: this.checkEmpty("died_at"),
        },
      ],
      checkboxes: [
        {
          label: "198-я часть",
          key: "is198",
          children: this.checkEmpty("is198"),
        },
        {
          label: "Дроздовские части",
          key: "isDrozdovec",
          children: this.checkEmpty("isDrozdovec"),
        },
      ],
      bornPlace: [
        {
          label: "Губерния",
          key: "guberniya",
          children: this.checkEmpty("guberniya"),
          span: "filled",
        },
        {
          label: "Уезд",
          key: "uezd",
          children: this.checkEmpty("uezd"),
          span: "filled",
        },
        {
          label: "Волость",
          key: "volost",
          children: this.checkEmpty("volost"),
          span: "filled",
        },
        {
          label: "Населённый пункт",
          key: "locality",
          children: this.checkEmpty("locality"),
          span: "filled",
        },
      ],
    };
  }
}
