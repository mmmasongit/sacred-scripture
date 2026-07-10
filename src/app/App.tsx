import { useState, useMemo, useCallback, useRef } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Check,
  RotateCcw,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Trophy,
  GraduationCap,
} from "lucide-react";
import BOOK_ORDER_DATA from "../assets/order.json";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BibleVersion = "HRB" | "WOY";

interface VerseData {
  Book: string;
  Chapter: number;
  Verse: number;
  Scripture: string;
}

const BOOK_ORDER = BOOK_ORDER_DATA as string[];
const BOOK_ORDER_INDEX = new Map(BOOK_ORDER.map((book, index) => [book, index]));

// ─── Bible Data ───────────────────────────────────────────────────────────────
// Replace each array with your complete Bible JSON for that version.
// Same {Book,Chapter,Verse,Scripture} format. Bundled at build time — fully offline.

const HRB_DATA: VerseData[] = [
  // ══════════ Genesis 1 ══════════
  { Book: "Genesis", Chapter: 1, Verse: 1, Scripture: "In the beginning Elohim created the heaven and the earth." },
  { Book: "Genesis", Chapter: 1, Verse: 2, Scripture: "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of Elohim moved upon the face of the waters." },
  { Book: "Genesis", Chapter: 1, Verse: 3, Scripture: "And Elohim said, Let there be light: and there was light." },
  { Book: "Genesis", Chapter: 1, Verse: 4, Scripture: "And Elohim saw the light, that it was good: and Elohim divided the light from the darkness." },
  { Book: "Genesis", Chapter: 1, Verse: 5, Scripture: "And Elohim called the light Day, and the darkness he called Night. And the evening and the morning were the first day." },
  { Book: "Genesis", Chapter: 1, Verse: 6, Scripture: "And Elohim said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters." },
  { Book: "Genesis", Chapter: 1, Verse: 7, Scripture: "And Elohim made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so." },
  { Book: "Genesis", Chapter: 1, Verse: 8, Scripture: "And Elohim called the firmament Heaven. And the evening and the morning were the second day." },
  { Book: "Genesis", Chapter: 1, Verse: 9, Scripture: "And Elohim said, Let the waters under the heaven be gathered together unto one place, and let the dry land appear: and it was so." },
  { Book: "Genesis", Chapter: 1, Verse: 10, Scripture: "And Elohim called the dry land Earth; and the gathering together of the waters called he Seas: and Elohim saw that it was good." },
  { Book: "Genesis", Chapter: 1, Verse: 11, Scripture: "And Elohim said, Let the earth bring forth grass, the herb yielding seed, and the fruit tree yielding fruit after his kind, whose seed is in itself, upon the earth: and it was so." },
  { Book: "Genesis", Chapter: 1, Verse: 12, Scripture: "And the earth brought forth grass, and herb yielding seed after his kind, and the tree yielding fruit, whose seed was in itself, after his kind: and Elohim saw that it was good." },
  { Book: "Genesis", Chapter: 1, Verse: 13, Scripture: "And the evening and the morning were the third day." },
  { Book: "Genesis", Chapter: 1, Verse: 14, Scripture: "And Elohim said, Let there be lights in the firmament of the heaven to divide the day from the night; and let them be for signs, and for seasons, and for days, and years:" },
  { Book: "Genesis", Chapter: 1, Verse: 15, Scripture: "And let them be for lights in the firmament of the heaven to give light upon the earth: and it was so." },
  { Book: "Genesis", Chapter: 1, Verse: 16, Scripture: "And Elohim made two great lights; the greater light to rule the day, and the lesser light to rule the night: he made the stars also." },
  { Book: "Genesis", Chapter: 1, Verse: 17, Scripture: "And Elohim set them in the firmament of the heaven to give light upon the earth," },
  { Book: "Genesis", Chapter: 1, Verse: 18, Scripture: "And to rule over the day and over the night, and to divide the light from the darkness: and Elohim saw that it was good." },
  { Book: "Genesis", Chapter: 1, Verse: 19, Scripture: "And the evening and the morning were the fourth day." },
  { Book: "Genesis", Chapter: 1, Verse: 20, Scripture: "And Elohim said, Let the waters bring forth abundantly the moving creature that hath life, and fowl that may fly above the earth in the open firmament of heaven." },
  { Book: "Genesis", Chapter: 1, Verse: 21, Scripture: "And Elohim created great whales, and every living creature that moveth, which the waters brought forth abundantly, after their kind, and every winged fowl after his kind: and Elohim saw that it was good." },
  { Book: "Genesis", Chapter: 1, Verse: 22, Scripture: "And Elohim blessed them, saying, Be fruitful, and multiply, and fill the waters in the seas, and let fowl multiply in the earth." },
  { Book: "Genesis", Chapter: 1, Verse: 23, Scripture: "And the evening and the morning were the fifth day." },
  { Book: "Genesis", Chapter: 1, Verse: 24, Scripture: "And Elohim said, Let the earth bring forth the living creature after his kind, cattle, and creeping thing, and beast of the earth after his kind: and it was so." },
  { Book: "Genesis", Chapter: 1, Verse: 25, Scripture: "And Elohim made the beast of the earth after his kind, and cattle after their kind, and every thing that creepeth upon the earth after his kind: and Elohim saw that it was good." },
  { Book: "Genesis", Chapter: 1, Verse: 26, Scripture: "And Elohim said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth, and over every creeping thing that creepeth upon the earth." },
  { Book: "Genesis", Chapter: 1, Verse: 27, Scripture: "So Elohim created man in his own image, in the image of Elohim created he him; male and female created he them." },
  { Book: "Genesis", Chapter: 1, Verse: 28, Scripture: "And Elohim blessed them, and Elohim said unto them, Be fruitful, and multiply, and replenish the earth, and subdue it: and have dominion over the fish of the sea, and over the fowl of the air, and over every living thing that moveth upon the earth." },
  { Book: "Genesis", Chapter: 1, Verse: 29, Scripture: "And Elohim said, Behold, I have given you every herb bearing seed, which is upon the face of all the earth, and every tree, in the which is the fruit of a tree yielding seed; to you it shall be for meat." },
  { Book: "Genesis", Chapter: 1, Verse: 30, Scripture: "And to every beast of the earth, and to every fowl of the air, and to every thing that creepeth upon the earth, wherein there is life, I have given every green herb for meat: and it was so." },
  { Book: "Genesis", Chapter: 1, Verse: 31, Scripture: "And Elohim saw every thing that he had made, and, behold, it was very good. And the evening and the morning were the sixth day." },

  // ══════════ Genesis 2 ══════════
  { Book: "Genesis", Chapter: 2, Verse: 1, Scripture: "Thus the heavens and the earth were finished, and all the host of them." },
  { Book: "Genesis", Chapter: 2, Verse: 2, Scripture: "And on the seventh day Elohim ended his work which he had made; and he rested on the seventh day from all his work which he had made." },
  { Book: "Genesis", Chapter: 2, Verse: 3, Scripture: "And Elohim blessed the seventh day, and sanctified it: because that in it he had rested from all his work which Elohim created and made." },
  { Book: "Genesis", Chapter: 2, Verse: 4, Scripture: "These are the generations of the heavens and of the earth when they were created, in the day that Yahweh Elohim made the earth and the heavens," },
  { Book: "Genesis", Chapter: 2, Verse: 5, Scripture: "And every plant of the field before it was in the earth, and every herb of the field before it grew: for Yahweh Elohim had not caused it to rain upon the earth, and there was not a man to till the ground." },
  { Book: "Genesis", Chapter: 2, Verse: 6, Scripture: "But there went up a mist from the earth, and watered the whole face of the ground." },
  { Book: "Genesis", Chapter: 2, Verse: 7, Scripture: "And Yahweh Elohim formed man of the dust of the ground, and breathed into his nostrils the breath of life; and man became a living soul." },
  { Book: "Genesis", Chapter: 2, Verse: 8, Scripture: "And Yahweh Elohim planted a garden eastward in Eden; and there he put the man whom he had formed." },
  { Book: "Genesis", Chapter: 2, Verse: 9, Scripture: "And out of the ground made Yahweh Elohim to grow every tree that is pleasant to the sight, and good for food; the tree of life also in the midst of the garden, and the tree of knowledge of good and evil." },
  { Book: "Genesis", Chapter: 2, Verse: 15, Scripture: "And Yahweh Elohim took the man, and put him into the garden of Eden to dress it and to keep it." },
  { Book: "Genesis", Chapter: 2, Verse: 16, Scripture: "And Yahweh Elohim commanded the man, saying, Of every tree of the garden thou mayest freely eat:" },
  { Book: "Genesis", Chapter: 2, Verse: 17, Scripture: "But of the tree of the knowledge of good and evil, thou shalt not eat of it: for in the day that thou eatest thereof thou shalt surely die." },
  { Book: "Genesis", Chapter: 2, Verse: 18, Scripture: "And Yahweh Elohim said, It is not good that the man should be alone; I will make him an help meet for him." },
  { Book: "Genesis", Chapter: 2, Verse: 21, Scripture: "And Yahweh Elohim caused a deep sleep to fall upon Adam, and he slept: and he took one of his ribs, and closed up the flesh instead thereof;" },
  { Book: "Genesis", Chapter: 2, Verse: 22, Scripture: "And the rib, which Yahweh Elohim had taken from man, made he a woman, and brought her unto the man." },
  { Book: "Genesis", Chapter: 2, Verse: 23, Scripture: "And Adam said, This is now bone of my bones, and flesh of my flesh: she shall be called Woman, because she was taken out of Man." },
  { Book: "Genesis", Chapter: 2, Verse: 24, Scripture: "Therefore shall a man leave his father and his mother, and shall cleave unto his wife: and they shall be one flesh." },
  { Book: "Genesis", Chapter: 2, Verse: 25, Scripture: "And they were both naked, the man and his wife, and were not ashamed." },

  // ══════════ Genesis 3 ══════════
  { Book: "Genesis", Chapter: 3, Verse: 1, Scripture: "Now the serpent was more subtil than any beast of the field which Yahweh Elohim had made. And he said unto the woman, Yea, hath Elohim said, Ye shall not eat of every tree of the garden?" },
  { Book: "Genesis", Chapter: 3, Verse: 2, Scripture: "And the woman said unto the serpent, We may eat of the fruit of the trees of the garden:" },
  { Book: "Genesis", Chapter: 3, Verse: 3, Scripture: "But of the fruit of the tree which is in the midst of the garden, Elohim hath said, Ye shall not eat of it, neither shall ye touch it, lest ye die." },
  { Book: "Genesis", Chapter: 3, Verse: 4, Scripture: "And the serpent said unto the woman, Ye shall not surely die:" },
  { Book: "Genesis", Chapter: 3, Verse: 5, Scripture: "For Elohim doth know that in the day ye eat thereof, then your eyes shall be opened, and ye shall be as gods, knowing good and evil." },
  { Book: "Genesis", Chapter: 3, Verse: 6, Scripture: "And when the woman saw that the tree was good for food, and that it was pleasant to the eyes, and a tree to be desired to make one wise, she took of the fruit thereof, and did eat, and gave also unto her husband with her; and he did eat." },
  { Book: "Genesis", Chapter: 3, Verse: 7, Scripture: "And the eyes of them both were opened, and they knew that they were naked; and they sewed fig leaves together, and made themselves aprons." },
  { Book: "Genesis", Chapter: 3, Verse: 8, Scripture: "And they heard the voice of Yahweh Elohim walking in the garden in the cool of the day: and Adam and his wife hid themselves from the presence of Yahweh Elohim amongst the trees of the garden." },
  { Book: "Genesis", Chapter: 3, Verse: 15, Scripture: "And I will put enmity between thee and the woman, and between thy seed and her seed; it shall bruise thy head, and thou shalt bruise his heel." },
  { Book: "Genesis", Chapter: 3, Verse: 19, Scripture: "In the sweat of thy face shalt thou eat bread, till thou return unto the ground; for out of it wast thou taken: for dust thou art, and unto dust shalt thou return." },
  { Book: "Genesis", Chapter: 3, Verse: 24, Scripture: "So he drove out the man; and he placed at the east of the garden of Eden Cherubims, and a flaming sword which turned every way, to keep the way of the tree of life." },

  // ══════════ Psalms 23 ══════════
  { Book: "Psalms", Chapter: 23, Verse: 1, Scripture: "Yahweh is my shepherd; I shall not want." },
  { Book: "Psalms", Chapter: 23, Verse: 2, Scripture: "He maketh me to lie down in green pastures: he leadeth me beside the still waters." },
  { Book: "Psalms", Chapter: 23, Verse: 3, Scripture: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake." },
  { Book: "Psalms", Chapter: 23, Verse: 4, Scripture: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me." },
  { Book: "Psalms", Chapter: 23, Verse: 5, Scripture: "Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over." },
  { Book: "Psalms", Chapter: 23, Verse: 6, Scripture: "Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of Yahweh for ever." },

  // ══════════ Psalms 119 (selected) ══════════
  { Book: "Psalms", Chapter: 119, Verse: 1, Scripture: "Blessed are the undefiled in the way, who walk in the law of Yahweh." },
  { Book: "Psalms", Chapter: 119, Verse: 2, Scripture: "Blessed are they that keep his testimonies, and that seek him with the whole heart." },
  { Book: "Psalms", Chapter: 119, Verse: 9, Scripture: "Wherewithal shall a young man cleanse his way? by taking heed thereto according to thy word." },
  { Book: "Psalms", Chapter: 119, Verse: 11, Scripture: "Thy word have I hid in mine heart, that I might not sin against thee." },
  { Book: "Psalms", Chapter: 119, Verse: 18, Scripture: "Open thou mine eyes, that I may behold wondrous things out of thy law." },
  { Book: "Psalms", Chapter: 119, Verse: 105, Scripture: "Thy word is a lamp unto my feet, and a light unto my path." },
  { Book: "Psalms", Chapter: 119, Verse: 130, Scripture: "The entrance of thy words giveth light; it giveth understanding unto the simple." },
  { Book: "Psalms", Chapter: 119, Verse: 165, Scripture: "Great peace have they which love thy law: and nothing shall offend them." },

  // ══════════ John 1 ══════════
  { Book: "John", Chapter: 1, Verse: 1, Scripture: "In the beginning was the Word, and the Word was with Elohim, and the Word was Elohim." },
  { Book: "John", Chapter: 1, Verse: 2, Scripture: "The same was in the beginning with Elohim." },
  { Book: "John", Chapter: 1, Verse: 3, Scripture: "All things were made by him; and without him was not any thing made that was made." },
  { Book: "John", Chapter: 1, Verse: 4, Scripture: "In him was life; and the life was the light of men." },
  { Book: "John", Chapter: 1, Verse: 5, Scripture: "And the light shineth in darkness; and the darkness comprehended it not." },
  { Book: "John", Chapter: 1, Verse: 14, Scripture: "And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth." },

  // ══════════ John 3 ══════════
  { Book: "John", Chapter: 3, Verse: 16, Scripture: "For Elohim so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." },
  { Book: "John", Chapter: 3, Verse: 17, Scripture: "For Elohim sent not his Son into the world to condemn the world; but that the world through him might be saved." },
  { Book: "John", Chapter: 3, Verse: 18, Scripture: "He that believeth on him is not condemned: but he that believeth not is condemned already, because he hath not believed in the name of the only begotten Son of Elohim." },
  { Book: "John", Chapter: 3, Verse: 19, Scripture: "And this is the condemnation, that light is come into the world, and men loved darkness rather than light, because their deeds were evil." },
  { Book: "John", Chapter: 3, Verse: 20, Scripture: "For every one that doeth evil hateth the light, neither cometh to the light, lest his deeds should be reproved." },
  { Book: "John", Chapter: 3, Verse: 21, Scripture: "But he that doeth truth cometh to the light, that his deeds may be made manifest, that they are wrought in Elohim." },
];

// ─── WOY Data ────────────────────────────────────────────────────────────────
// Replace with your complete Walk of Yahweh (WOY) Bible JSON.

const WOY_DATA: VerseData[] = [
  // ══════════ Genesis 1 ══════════
  { Book: "Genesis", Chapter: 1, Verse: 1, Scripture: "In the beginning Elohim created the heavens and the earth." },
  { Book: "Genesis", Chapter: 1, Verse: 2, Scripture: "And the earth was without form and empty, and darkness was on the face of the deep, and the Ruach of Elohim was hovering over the face of the waters." },
  { Book: "Genesis", Chapter: 1, Verse: 3, Scripture: "And Elohim said, Let light come to be, and light came to be." },
  { Book: "Genesis", Chapter: 1, Verse: 4, Scripture: "And Elohim saw the light, that it was good. And Elohim separated the light from the darkness." },
  { Book: "Genesis", Chapter: 1, Verse: 5, Scripture: "And Elohim called the light Day, and the darkness He called Night. And there came to be evening and there came to be morning, the first day." },
  { Book: "Genesis", Chapter: 1, Verse: 6, Scripture: "And Elohim said, Let an expanse come to be in the midst of the waters, and let it separate the waters from the waters." },
  { Book: "Genesis", Chapter: 1, Verse: 7, Scripture: "And Elohim made the expanse, and separated the waters which were under the expanse from the waters which were above the expanse. And it came to be so." },
  { Book: "Genesis", Chapter: 1, Verse: 8, Scripture: "And Elohim called the expanse Heavens. And there came to be evening and there came to be morning, the second day." },
  { Book: "Genesis", Chapter: 1, Verse: 9, Scripture: "And Elohim said, Let the waters under the heavens be gathered into one place, and let the dry land appear. And it came to be so." },
  { Book: "Genesis", Chapter: 1, Verse: 10, Scripture: "And Elohim called the dry land Earth, and the collection of the waters He called Seas. And Elohim saw that it was good." },
  { Book: "Genesis", Chapter: 1, Verse: 11, Scripture: "And Elohim said, Let the earth bring forth grass, the plant that yields seed, and the fruit tree that yields fruit according to its kind, whose seed is in itself, on the earth. And it came to be so." },
  { Book: "Genesis", Chapter: 1, Verse: 12, Scripture: "And the earth brought forth grass, the plant yielding seed according to its kind, and the tree yielding fruit, whose seed is in itself, according to its kind. And Elohim saw that it was good." },
  { Book: "Genesis", Chapter: 1, Verse: 13, Scripture: "And there came to be evening and there came to be morning, the third day." },
  { Book: "Genesis", Chapter: 1, Verse: 14, Scripture: "And Elohim said, Let lights come to be in the expanse of the heavens to separate the day from the night, and let them be for signs and for appointed times, and for days and years," },
  { Book: "Genesis", Chapter: 1, Verse: 15, Scripture: "and let them be for lights in the expanse of the heavens to give light on the earth. And it came to be so." },
  { Book: "Genesis", Chapter: 1, Verse: 16, Scripture: "And Elohim made two great lights: the greater light to rule the day, and the lesser light to rule the night, and the stars." },
  { Book: "Genesis", Chapter: 1, Verse: 17, Scripture: "And Elohim set them in the expanse of the heavens to give light on the earth," },
  { Book: "Genesis", Chapter: 1, Verse: 18, Scripture: "and to rule over the day and over the night, and to separate the light from the darkness. And Elohim saw that it was good." },
  { Book: "Genesis", Chapter: 1, Verse: 19, Scripture: "And there came to be evening and there came to be morning, the fourth day." },
  { Book: "Genesis", Chapter: 1, Verse: 20, Scripture: "And Elohim said, Let the waters teem with swarms of living creatures, and let birds fly above the earth on the face of the expanse of the heavens." },
  { Book: "Genesis", Chapter: 1, Verse: 21, Scripture: "And Elohim created great sea creatures and every living creature that moves, with which the waters swarmed, according to their kind, and every winged bird according to its kind. And Elohim saw that it was good." },
  { Book: "Genesis", Chapter: 1, Verse: 22, Scripture: "And Elohim blessed them, saying, Be fruitful and increase, and fill the waters in the seas, and let the birds increase on the earth." },
  { Book: "Genesis", Chapter: 1, Verse: 23, Scripture: "And there came to be evening and there came to be morning, the fifth day." },
  { Book: "Genesis", Chapter: 1, Verse: 24, Scripture: "And Elohim said, Let the earth bring forth living creatures according to their kinds: livestock and creeping creatures and beasts of the earth, according to their kinds. And it came to be so." },
  { Book: "Genesis", Chapter: 1, Verse: 25, Scripture: "And Elohim made the beasts of the earth according to their kinds, and livestock according to their kinds, and all creeping creatures of the ground according to their kinds. And Elohim saw that it was good." },
  { Book: "Genesis", Chapter: 1, Verse: 26, Scripture: "And Elohim said, Let Us make man in Our image, according to Our likeness, and let them rule over the fish of the sea, and over the birds of the heavens, and over the livestock, and over all the earth and over all the creeping creatures that creep on the earth." },
  { Book: "Genesis", Chapter: 1, Verse: 27, Scripture: "And Elohim created man in His image, in the image of Elohim He created him — male and female He created them." },
  { Book: "Genesis", Chapter: 1, Verse: 28, Scripture: "And Elohim blessed them, and Elohim said to them, Be fruitful and increase, and fill the earth and subdue it, and rule over the fish of the sea, and over the birds of the heavens, and over all creatures moving on the earth." },
  { Book: "Genesis", Chapter: 1, Verse: 29, Scripture: "And Elohim said, See, I have given you every plant that yields seed which is on the face of all the earth, and every tree whose fruit yields seed, to you it is for food." },
  { Book: "Genesis", Chapter: 1, Verse: 30, Scripture: "And to every beast of the earth, and to every bird of the heavens, and to every creeping creature on the earth, in which there is life, every green plant is for food. And it came to be so." },
  { Book: "Genesis", Chapter: 1, Verse: 31, Scripture: "And Elohim saw all that He had made, and see, it was very good. And there came to be evening and there came to be morning, the sixth day." },

  // ══════════ Genesis 2 ══════════
  { Book: "Genesis", Chapter: 2, Verse: 1, Scripture: "Thus the heavens and the earth were completed, and all their host." },
  { Book: "Genesis", Chapter: 2, Verse: 2, Scripture: "And on the seventh day Elohim completed His work which He had done, and He rested on the seventh day from all His work which He had made." },
  { Book: "Genesis", Chapter: 2, Verse: 3, Scripture: "And Elohim blessed the seventh day and set it apart, because on it He rested from all His work which Elohim in creating had made." },
  { Book: "Genesis", Chapter: 2, Verse: 4, Scripture: "These are the births of the heavens and the earth when they were created, in the day that Yahweh Elohim made earth and heavens." },
  { Book: "Genesis", Chapter: 2, Verse: 7, Scripture: "And Yahweh Elohim formed the man from the dust of the ground, and breathed into his nostrils breath of life. And the man became a living being." },
  { Book: "Genesis", Chapter: 2, Verse: 15, Scripture: "And Yahweh Elohim took the man and put him in the garden of Eden to work it and to guard it." },
  { Book: "Genesis", Chapter: 2, Verse: 17, Scripture: "but of the tree of the knowledge of good and evil you are not to eat, for in the day that you eat of it you shall certainly die." },
  { Book: "Genesis", Chapter: 2, Verse: 24, Scripture: "For this cause a man shall leave his father and mother, and cleave to his wife, and they shall become one flesh." },

  // ══════════ Genesis 3 ══════════
  { Book: "Genesis", Chapter: 3, Verse: 1, Scripture: "And the serpent was more crafty than any beast of the field which Yahweh Elohim had made, and he said to the woman, Is it true that Elohim has said, Do not eat of every tree of the garden?" },
  { Book: "Genesis", Chapter: 3, Verse: 4, Scripture: "And the serpent said to the woman, You shall certainly not die." },
  { Book: "Genesis", Chapter: 3, Verse: 6, Scripture: "And the woman saw that the tree was good for food, that it was pleasant to the eyes, and a tree desirable to make one wise, and she took of its fruit and ate. And she also gave to her husband with her, and he ate." },
  { Book: "Genesis", Chapter: 3, Verse: 15, Scripture: "And I put enmity between you and the woman, and between your seed and her Seed. He shall crush your head, and you shall crush His heel." },
  { Book: "Genesis", Chapter: 3, Verse: 19, Scripture: "By the sweat of your face you are to eat bread until you return to the ground, for out of it you were taken. For dust you are, and to dust you return." },

  // ══════════ Psalms 23 ══════════
  { Book: "Psalms", Chapter: 23, Verse: 1, Scripture: "Yahweh is my shepherd; I do not lack." },
  { Book: "Psalms", Chapter: 23, Verse: 2, Scripture: "He makes me to lie down in green pastures; He leads me beside still waters." },
  { Book: "Psalms", Chapter: 23, Verse: 3, Scripture: "He turns back my being; He leads me in paths of righteousness for His Name's sake." },
  { Book: "Psalms", Chapter: 23, Verse: 4, Scripture: "Even when I walk through the valley of the shadow of death, I fear no evil. For You are with me; Your rod and Your staff, they comfort me." },
  { Book: "Psalms", Chapter: 23, Verse: 5, Scripture: "You prepare a table before me in the face of my enemies; You have anointed my head with oil; my cup runs over." },
  { Book: "Psalms", Chapter: 23, Verse: 6, Scripture: "Surely goodness and kindness shall follow me all the days of my life; and I shall dwell in the House of Yahweh, to the length of days!" },

  // ══════════ Psalms 119 (selected) ══════════
  { Book: "Psalms", Chapter: 119, Verse: 1, Scripture: "Blessed are the perfect in the way, who walk in the Torah of Yahweh!" },
  { Book: "Psalms", Chapter: 119, Verse: 2, Scripture: "Blessed are those who observe His witnesses, who seek Him with all the heart!" },
  { Book: "Psalms", Chapter: 119, Verse: 9, Scripture: "How would a young man cleanse his path? To guard it according to Your Word." },
  { Book: "Psalms", Chapter: 119, Verse: 11, Scripture: "I have treasured up Your Word in my heart, so that I do not sin against You." },
  { Book: "Psalms", Chapter: 119, Verse: 105, Scripture: "Your Word is a lamp to my feet and a light to my path." },

  // ══════════ John 1 ══════════
  { Book: "John", Chapter: 1, Verse: 1, Scripture: "In the beginning was the Word, and the Word was with Elohim, and the Word was Elohim." },
  { Book: "John", Chapter: 1, Verse: 2, Scripture: "He was in the beginning with Elohim." },
  { Book: "John", Chapter: 1, Verse: 3, Scripture: "All came to be through Him, and without Him not even one came to be that came to be." },
  { Book: "John", Chapter: 1, Verse: 4, Scripture: "In Him was life, and the life was the light of men." },
  { Book: "John", Chapter: 1, Verse: 14, Scripture: "And the Word became flesh and pitched His tent among us, and we saw His esteem, esteem as of an only brought-forth of a father, complete in favour and truth." },

  // ══════════ John 3 ══════════
  { Book: "John", Chapter: 3, Verse: 16, Scripture: "For Elohim so loved the world that He gave His only brought-forth Son, so that everyone who believes in Him should not perish but possess everlasting life." },
  { Book: "John", Chapter: 3, Verse: 17, Scripture: "For Elohim did not send His Son into the world to judge the world, but that the world through Him might be saved." },
  { Book: "John", Chapter: 3, Verse: 18, Scripture: "He who believes in Him is not judged, but he who does not believe is judged already, because he has not believed in the Name of the only brought-forth Son of Elohim." },
  { Book: "John", Chapter: 3, Verse: 19, Scripture: "And this is the judgment, that the light has come into the world, and men loved the darkness rather than the light, for their works were wicked." },
  { Book: "John", Chapter: 3, Verse: 20, Scripture: "For everyone who is practising evil hates the light and does not come to the light, lest his works should be exposed." },
  { Book: "John", Chapter: 3, Verse: 21, Scripture: "But the one doing the truth comes to the light, so that his works are clearly seen, that they have been wrought in Elohim." },
];

type VerseModule = { default: VerseData[] };

const HRB_BOOK_MODULES = import.meta.glob("../assets/hrb/*.json", { eager: true }) as Record<string, VerseModule>;
const WOY_BOOK_MODULES = import.meta.glob("../assets/woy/*.json", { eager: true }) as Record<string, VerseModule>;

function cleanScriptureText(scripture: string): string {
  return scripture
    .replace(/\{\\[^}]+\}/g, "")
    .replace(/\r/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function loadVersionData(modules: Record<string, VerseModule>): VerseData[] {
  return Object.keys(modules)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .flatMap((path) => modules[path].default)
    .map((verse) => ({
      ...verse,
      Scripture: cleanScriptureText(verse.Scripture),
    }));
}

const VERSION_DATA: Record<BibleVersion, VerseData[]> = {
  HRB: loadVersionData(HRB_BOOK_MODULES),
  WOY: loadVersionData(WOY_BOOK_MODULES),
};

// ─── Data Helpers ─────────────────────────────────────────────────────────────

function getBooks(data: VerseData[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const v of data) {
    if (!seen.has(v.Book)) { seen.add(v.Book); result.push(v.Book); }
  }
  return result.sort((a, b) => {
    const ai = BOOK_ORDER_INDEX.get(a);
    const bi = BOOK_ORDER_INDEX.get(b);
    if (ai !== undefined && bi !== undefined) return ai - bi;
    if (ai !== undefined) return -1;
    if (bi !== undefined) return 1;
    return a.localeCompare(b, undefined, { numeric: true });
  });
}

function getChapters(data: VerseData[], book: string): number[] {
  const seen = new Set<number>();
  const result: number[] = [];
  for (const v of data) {
    if (v.Book === book && !seen.has(v.Chapter)) { seen.add(v.Chapter); result.push(v.Chapter); }
  }
  return result.sort((a, b) => a - b);
}

function getVerses(data: VerseData[], book: string, chapter: number): VerseData[] {
  return data
    .filter(v => v.Book === book && v.Chapter === chapter)
    .sort((a, b) => a.Verse - b.Verse);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Reader Mode ─────────────────────────────────────────────────────────────

function ReaderMode({ data }: { data: VerseData[] }) {
  const books = useMemo(() => getBooks(data), [data]);
  const [selectedBook, setSelectedBook] = useState(books[0] ?? "");
  const [expandedBook, setExpandedBook] = useState<string>(books[0] ?? "");
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  const chapters = useMemo(() => getChapters(data, selectedBook), [data, selectedBook]);
  const verses = useMemo(() => getVerses(data, selectedBook, selectedChapter), [data, selectedBook, selectedChapter]);

  const selectChapter = useCallback((book: string, chapter: number) => {
    setSelectedBook(book);
    setSelectedChapter(chapter);
    setSidebarOpen(false);
    setTimeout(() => mainRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 50);
  }, []);

  const allBooks = books;
  const currentBookIndex = allBooks.indexOf(selectedBook);
  const currentChapterIndex = chapters.indexOf(selectedChapter);
  const hasPrev = currentChapterIndex > 0 || currentBookIndex > 0;
  const hasNext = currentChapterIndex < chapters.length - 1 || currentBookIndex < allBooks.length - 1;

  const goToPrev = () => {
    if (currentChapterIndex > 0) {
      selectChapter(selectedBook, chapters[currentChapterIndex - 1]);
    } else if (currentBookIndex > 0) {
      const prevBook = allBooks[currentBookIndex - 1];
      const prevChapters = getChapters(data, prevBook);
      selectChapter(prevBook, prevChapters[prevChapters.length - 1]);
    }
  };

  const goToNext = () => {
    if (currentChapterIndex < chapters.length - 1) {
      selectChapter(selectedBook, chapters[currentChapterIndex + 1]);
    } else if (currentBookIndex < allBooks.length - 1) {
      const nextBook = allBooks[currentBookIndex + 1];
      const nextChapters = getChapters(data, nextBook);
      selectChapter(nextBook, nextChapters[0]);
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden relative">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "fixed lg:relative inset-y-0 left-0 z-30 lg:z-auto",
          "w-64 flex-shrink-0 flex flex-col",
          "bg-card border-r border-border overflow-hidden",
          "transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Books</span>
          <button
            className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={15} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-1 [scrollbar-width:none]">
          {books.map((book) => {
            const bookChapters = getChapters(data, book);
            const isExpanded = expandedBook === book;
            const isActive = selectedBook === book;
            return (
              <div key={book}>
                <button
                  onClick={() => {
                    setExpandedBook(isExpanded ? "" : book);
                  }}
                  className={[
                    "w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition-colors duration-150",
                    isActive
                      ? "text-foreground bg-secondary font-medium"
                      : "text-foreground/80 hover:bg-muted hover:text-foreground",
                  ].join(" ")}
                >
                  <span>{book}</span>
                  {isExpanded ? (
                    <ChevronUp size={13} className="text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown size={13} className="text-muted-foreground flex-shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-3 pt-1 flex flex-wrap gap-1.5 bg-muted/40">
                    {bookChapters.map((ch) => {
                      const isChActive = isActive && selectedChapter === ch;
                      return (
                        <button
                          key={ch}
                          onClick={() => selectChapter(book, ch)}
                          className={[
                            "w-8 h-8 text-xs rounded transition-colors duration-150 font-mono",
                            isChActive
                              ? "bg-primary text-primary-foreground"
                              : "bg-card text-muted-foreground border border-border hover:bg-secondary hover:text-foreground",
                          ].join(" ")}
                        >
                          {ch}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main Reading Area */}
      <main ref={mainRef} className="flex-1 overflow-y-auto [scrollbar-width:thin]">
        {/* Mobile topbar */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-2.5 flex items-center gap-3 lg:hidden z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm text-muted-foreground">
            {selectedBook} &middot; Chapter {selectedChapter}
          </span>
        </div>

        <div className="max-w-2xl mx-auto px-6 md:px-10 py-12">
          {/* Chapter heading */}
          <div className="mb-10 pb-8 border-b border-border">
            <p className="text-xs uppercase tracking-[0.22em] text-accent mb-3">{selectedBook}</p>
            <h2
              className="text-5xl text-foreground leading-tight"
              style={{ fontFamily: "'Cinzel', Georgia, serif" }}
            >
              Chapter {selectedChapter}
            </h2>
            <p className="text-sm text-muted-foreground mt-2">{verses.length} verse{verses.length !== 1 ? "s" : ""}</p>
          </div>

          {/* Verses */}
          {verses.length === 0 ? (
            <p className="text-muted-foreground italic">No verses found for this chapter.</p>
          ) : (
            <div className="space-y-0">
              {verses.map((v) => (
                <p key={v.Verse} className="leading-8 text-[1.0625rem] text-foreground mb-1">
                  <sup className="text-accent text-[0.625rem] font-mono mr-1 select-none">{v.Verse}</sup>
                  {v.Scripture}
                </p>
              ))}
            </div>
          )}

          {/* Chapter navigation */}
          <div className="flex items-center justify-between mt-16 pt-8 border-t border-border">
            <button
              onClick={goToPrev}
              disabled={!hasPrev}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={15} />
              Previous
            </button>
            <span className="text-xs text-muted-foreground font-mono">
              {selectedBook} {selectedChapter}
            </span>
            <button
              onClick={goToNext}
              disabled={!hasNext}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── Flashcard Component ──────────────────────────────────────────────────────

function FlashCard({
  verse,
  isFlipped,
  onClick,
}: {
  verse: VerseData;
  isFlipped: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer select-none w-full"
      style={{ perspective: "1200px" }}
    >
      <div
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          position: "relative",
          minHeight: "280px",
        }}
      >
        {/* Front — reference */}
        <div
          className="absolute inset-0 bg-card border border-border rounded-xl flex flex-col items-center justify-center p-8 shadow-sm"
          style={{ backfaceVisibility: "hidden" }}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8">
            Scripture Reference
          </p>
          <p
            className="text-4xl md:text-5xl text-foreground text-center leading-tight"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            {verse.Book}
          </p>
          <p
            className="text-2xl md:text-3xl text-accent mt-3"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            {verse.Chapter}:{verse.Verse}
          </p>
          <p className="text-xs text-muted-foreground mt-10">Tap to reveal the verse</p>
        </div>

        {/* Back — scripture */}
        <div
          className="absolute inset-0 bg-primary text-primary-foreground rounded-xl flex flex-col items-center justify-center p-8 shadow-md"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p
            className="text-xs uppercase tracking-[0.2em] text-primary-foreground/50 mb-6"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            {verse.Book} {verse.Chapter}:{verse.Verse}
          </p>
          <p className="text-lg leading-8 text-center text-primary-foreground max-w-md">
            &ldquo;{verse.Scripture}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Study Mode ───────────────────────────────────────────────────────────────

type StudyPhase = "select" | "quiz" | "results";

function StudyMode({ data }: { data: VerseData[] }) {
  const books = useMemo(() => getBooks(data), [data]);
  const [phase, setPhase] = useState<StudyPhase>("select");
  const [selectedBook, setSelectedBook] = useState("");
  const [cards, setCards] = useState<VerseData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCount, setKnownCount] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const startStudy = (book: string) => {
    const bookVerses = data.filter((v) => v.Book === book);
    setSelectedBook(book);
    setCards(shuffle(bookVerses));
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCount(0);
    setPhase("quiz");
  };

  const advance = useCallback(
    (wasKnown: boolean) => {
      if (transitioning) return;
      setTransitioning(true);
      if (wasKnown) setKnownCount((c) => c + 1);
      setIsFlipped(false);
      setTimeout(() => {
        if (currentIndex < cards.length - 1) {
          setCurrentIndex((i) => i + 1);
        } else {
          setPhase("results");
        }
        setTransitioning(false);
      }, 320);
    },
    [currentIndex, cards.length, transitioning]
  );

  const goBack = () => {
    if (transitioning || currentIndex === 0) return;
    setTransitioning(true);
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((i) => i - 1);
      setTransitioning(false);
    }, 320);
  };

  const restart = () => {
    setCards(shuffle(cards));
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCount(0);
    setPhase("quiz");
  };

  // ── Book selection ──
  if (phase === "select") {
    return (
      <div className="flex-1 overflow-y-auto [scrollbar-width:thin]">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.22em] text-accent mb-3">Study Mode</p>
            <h2
              className="text-4xl text-foreground"
              style={{ fontFamily: "'Cinzel', Georgia, serif" }}
            >
              Choose a Book
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Select a book and we will quiz you on its verses with flashcards.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {books.map((book) => {
              const count = data.filter((v) => v.Book === book).length;
              const chapterCount = getChapters(data, book).length;
              return (
                <button
                  key={book}
                  onClick={() => startStudy(book)}
                  className="group bg-card border border-border rounded-lg p-4 text-left hover:border-accent/60 hover:bg-accent/5 transition-all duration-200 hover:shadow-sm"
                >
                  <p
                    className="font-medium text-foreground group-hover:text-accent transition-colors text-sm leading-snug"
                    style={{ fontFamily: "'Cinzel', Georgia, serif" }}
                  >
                    {book}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {chapterCount} ch &middot; {count} verses
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Results ──
  if (phase === "results") {
    const pct = cards.length > 0 ? Math.round((knownCount / cards.length) * 100) : 0;
    const reviewCount = cards.length - knownCount;

    return (
      <div className="flex-1 overflow-y-auto flex items-center justify-center p-6">
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <Trophy size={26} className="text-accent" />
          </div>
          <h2
            className="text-4xl text-foreground mb-1"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            Complete
          </h2>
          <p className="text-muted-foreground text-sm mb-8">
            {selectedBook} &middot; {cards.length} verses reviewed
          </p>

          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <div className="flex justify-around divide-x divide-border">
              <div className="px-4">
                <p className="text-4xl text-foreground" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>
                  {knownCount}
                </p>
                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Known</p>
              </div>
              <div className="px-4">
                <p className="text-4xl text-foreground" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>
                  {reviewCount}
                </p>
                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Review</p>
              </div>
              <div className="px-4">
                <p className="text-4xl text-accent" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>
                  {pct}%
                </p>
                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Score</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={restart}
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity"
            >
              Study Again
            </button>
            <button
              onClick={() => setPhase("select")}
              className="px-5 py-2.5 bg-muted text-foreground rounded-lg text-sm hover:bg-secondary transition-colors"
            >
              New Book
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Quiz ──
  const currentCard = cards[currentIndex];
  const progress = cards.length > 0 ? (currentIndex / cards.length) * 100 : 0;

  return (
    <div className="flex-1 overflow-y-auto [scrollbar-width:thin]">
      <div className="max-w-xl mx-auto px-4 md:px-6 py-10">
        {/* Session header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setPhase("select")}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft size={14} />
            Books
          </button>
          <div className="text-center">
            <p
              className="text-sm text-foreground"
              style={{ fontFamily: "'Cinzel', Georgia, serif" }}
            >
              {selectedBook}
            </p>
          </div>
          <span className="text-sm font-mono text-muted-foreground">
            {currentIndex + 1} / {cards.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-muted rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Card */}
        {currentCard && (
          <FlashCard
            verse={currentCard}
            isFlipped={isFlipped}
            onClick={() => setIsFlipped((f) => !f)}
          />
        )}

        {/* Action row */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={goBack}
            disabled={currentIndex === 0 || transitioning}
            className="p-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Previous card"
          >
            <ChevronLeft size={18} />
          </button>

          {isFlipped ? (
            <>
              <button
                onClick={() => advance(false)}
                disabled={transitioning}
                className="flex-1 py-3 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw size={14} />
                Review Again
              </button>
              <button
                onClick={() => advance(true)}
                disabled={transitioning}
                className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Check size={14} />
                I Know This
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsFlipped(true)}
              className="flex-1 py-3 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
            >
              Reveal Verse
            </button>
          )}

          <button
            onClick={() => advance(false)}
            disabled={transitioning}
            className="p-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Skip"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {!isFlipped && (
          <p className="text-center text-xs text-muted-foreground mt-4">
            Tap the card or &ldquo;Reveal Verse&rdquo; to see the scripture
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

type AppMode = "reader" | "study";

const VERSION_LABELS: Record<BibleVersion, { short: string; long: string }> = {
  HRB: { short: "HRB", long: "Hebrew Roots Bible" },
  WOY: { short: "WOY", long: "Walk of Yahweh" },
};

export default function App() {
  const [mode, setMode] = useState<AppMode>("reader");
  const [version, setVersion] = useState<BibleVersion>("HRB");
  const [showVersionMenu, setShowVersionMenu] = useState(false);

  const activeData = VERSION_DATA[version];

  const switchVersion = (v: BibleVersion) => {
    setVersion(v);
    setShowVersionMenu(false);
  };

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden" onClick={() => setShowVersionMenu(false)}>
      {/* Header */}
      <header className="flex-shrink-0 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 md:px-5 h-14 gap-3">

          {/* Logo */}
          <div className="flex items-center gap-2 min-w-0">
            <BookOpen size={16} className="text-accent flex-shrink-0" />
            <span
              className="text-sm md:text-base text-foreground tracking-wide truncate"
              style={{ fontFamily: "'Cinzel', Georgia, serif" }}
            >
              Sacred Scripture
            </span>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* Version switcher */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowVersionMenu((v) => !v)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border bg-background text-xs text-foreground hover:bg-muted transition-colors"
                title={VERSION_LABELS[version].long}
              >
                <span
                  className="font-medium tracking-widest"
                  style={{ fontFamily: "'Cinzel', Georgia, serif" }}
                >
                  {version}
                </span>
                <ChevronDown size={11} className="text-muted-foreground" />
              </button>

              {showVersionMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-52 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Translation</p>
                  </div>
                  {(["HRB", "WOY"] as BibleVersion[]).map((v) => (
                    <button
                      key={v}
                      onClick={() => switchVersion(v)}
                      className={[
                        "w-full flex items-center justify-between px-3 py-2.5 text-left text-sm transition-colors",
                        version === v
                          ? "bg-accent/10 text-foreground"
                          : "text-foreground/80 hover:bg-muted",
                      ].join(" ")}
                    >
                      <div>
                        <span
                          className="font-medium text-xs tracking-widest mr-2"
                          style={{ fontFamily: "'Cinzel', Georgia, serif" }}
                        >
                          {v}
                        </span>
                        <span className="text-xs text-muted-foreground">{VERSION_LABELS[v].long}</span>
                      </div>
                      {version === v && (
                        <Check size={13} className="text-accent flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="w-px h-5 bg-border" />

            {/* Mode toggle */}
            <div className="flex items-center bg-muted rounded-lg p-1 gap-0.5">
              <button
                onClick={() => setMode("reader")}
                className={[
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all duration-200",
                  mode === "reader"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                <BookOpen size={12} />
                <span className="hidden sm:inline">Reader</span>
              </button>
              <button
                onClick={() => setMode("study")}
                className={[
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all duration-200",
                  mode === "study"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                <GraduationCap size={12} />
                <span className="hidden sm:inline">Study</span>
              </button>
            </div>
          </div>
        </div>

        {/* Version banner — visible below header on mobile */}
        <div className="sm:hidden px-4 pb-2 flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
            {VERSION_LABELS[version].long}
          </span>
        </div>
      </header>

      {/* Body — key forces full remount when version changes, resetting selections */}
      <div className="flex-1 overflow-hidden flex" key={version}>
        {mode === "reader" ? (
          <ReaderMode data={activeData} />
        ) : (
          <StudyMode data={activeData} />
        )}
      </div>
    </div>
  );
}
