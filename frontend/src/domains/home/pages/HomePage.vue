<template>
    <section class="relative overflow-hidden rounded-lg max-w-6xl mx-auto my-8">
        <img
        src="@/assets/image-boisson-homePageTop.svg"
        alt="Boisson Troupicool"
        class="w-full h-auto object-cover rounded-lg"
        />
        <div class="absolute inset-0 flex flex-col justify-end items-start text-white p-8 bg-black/40 rounded-lg">
        <h1 class="text-5xl font-bold mb-4">La Boisson Troupicool</h1>
        <p class="mb-6 text-xl leading-relaxed">
            Découvrez l’essence des tropiques dans chaque gorgée. <br />
            Nos boissons sont soigneusement élaborées pour capturer la fraîcheur, l’exotisme <br />
            et l’énergie des îles tropicales, vous offrant une expérience gustative inégalée.
        </p>
        <button class="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded">
            Voir nos produits
        </button>
        </div>
    </section>

    <section class="max-w-6xl mx-auto my-12 grid gap-12">
        <div class="flex flex-col md:flex-row items-center gap-8">
            <div class="md:w-1/2">
                <h2 class="text-2xl font-bold mb-4">Un Voyage Gustatif Vers les Tropiques</h2>
                <p>
                Avec Troupicool, chaque boisson est une invitation à explorer des saveurs nouvelles et exotiques.
                Que vous recherchiez un rafraîchissement fruité ou une expérience plus intense, nos boissons vous
                transportent vers des destinations ensoleillées, où le plaisir est roi.
                </p>
            </div>
            <div class="md:w-1/2">
                <img
                    src="@/assets/rectangle-1.svg"
                    alt="Image de destination tropicale"
                    class="w-full h-auto rounded-lg"
                    />
            </div>
        </div>

    <div class="flex flex-col md:flex-row items-center gap-8">
        <div class="md:w-1/2">
            <img
                src="@/assets/rectangle-2.svg"
                alt="Image de boissons tropicales"
                class="w-full h-auto rounded-lg"
            />
        </div>
        <div class="md:w-1/2">
            <h2 class="text-2xl font-bold mb-4">Une boisson pour chaque moment</h2>
            <p>
            Que ce soit pour une fête entre amis, un moment de détente en solo, ou une célébration spéciale,
            Troupicool a la boisson parfaite pour accompagner chaque occasion. Savourez la différence et faites
            de chaque instant un souvenir tropical.
            </p>
        </div>
    </div>
  </section>

    <section class="relative overflow-hidden rounded-lg max-w-6xl mx-auto my-8">
        <img
            src="@/assets/rectangle-3.svg"
            alt="Ingrédients Naturels"
            class="w-full h-auto object-cover rounded-lg"
        />
    </section>

    <section class="max-w-6xl mx-auto my-12">
        <h2 class="text-2xl font-bold mb-6">Nos nouvelles gammes de boissons</h2>
        <div class="grid grid-cols-6  gap-4">
            <div class="col-span-2 rounded-md">
                <img src="@/assets/rectangle-4.svg" alt="Image 1" class="w-full h-auto" />
            </div>
            <div class="col-span-2 rounded-md">
                <img src="@/assets/rectangle-5.svg" alt="Image 2" class="w-full h-auto" />
            </div>
            <div class="col-span-2 rounded-md">
                <img src="@/assets/rectangle-6.svg" alt="Image 3" class="w-full h-auto" />
            </div>
            <div class="col-span-4 rounded-md">
                <img src="@/assets/rectangle-7.svg" alt="Image 4" class="w-full h-auto" />
            </div>
            <div class="row-span-2 col-span-2 rounded-md">
                <img src="@/assets/rectangle-8.svg" alt="Image 5" class="w-full h-auto" />
            </div>
            <div class="col-span rounded-md">
                <img src="@/assets/rectangle-9.svg" alt="Image 6" class="w-full h-auto" />
            </div>
            <div class="col-span rounded-md">
                <img src="@/assets/rectangle-10.svg" alt="Image 7" class="w-full h-auto" />
            </div>
            <div class="col-span-2 rounded-md">
                <img src="@/assets/rectangle-11.svg" alt="Image 8" class="w-full h-auto" />
            </div>
        </div>
    </section>

    <section class="relative overflow-hidden rounded-lg max-w-6xl mx-auto my-8">
        <img
            src="@/assets/rectangle-12.svg"
            alt="Communauté troupicool"
            class="w-full h-auto object-cover rounded-lg"
        />
        <div class="absolute inset-0 flex flex-col justify-end items-start text-white p-8 bg-black/40 rounded-lg">
            <h1 class="text-5xl font-bold mb-4">Une communauté passionnée</h1>
            <p class="mb-6 text-xl leading-relaxed">
                Découvrez l'essence des tropiques dans chaque gorgée. <br />
                Nos boissons sont soigneusement élaborées pour capturer la fraîcheur, l'exotisme et <br /> 
                l'énergie des îles tropicales, vous offrant une expérience gustative inégalée.
            </p>
            <button class="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded">
                Nous rejoindre
            </button>
        </div>
    </section>
</template>

<script setup lang="ts"></script>
