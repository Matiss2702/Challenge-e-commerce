<template>
        <chakra-box maxW="lg" mx="auto" mt="10">
          <chakra-box pos="relative" overflow="hidden" borderRadius="xl">
            <chakra-box
              d="flex"
              transform="translateX(0%)"
              transition="transform 0.5s ease-in-out"
              :style="{ transform: `translateX(-${activeIndex * 100}%)` }"
            >
              <chakra-box
                v-for="(image, index) in images"
                :key="index"
                flex="none"
                w="100%"
                h="300px"
              >
                <chakra-img
                  :src="image.src"
                  :alt="image.alt"
                  w="100%"
                  h="100%"
                  objectFit="cover"
                  borderRadius="xl"
                />
              </chakra-box>
            </chakra-box>
      
            <chakra-button
              pos="absolute"
              top="50%"
              left="3"
              transform="translateY(-50%)"
              background="rgba(0, 0, 0, 0.5)"
              color="white"
              zIndex="2"
              @click="prevSlide"
            >
              ‹
            </chakra-button>
            <chakra-button
              pos="absolute"
              top="50%"
              right="3"
              transform="translateY(-50%)"
              background="rgba(0, 0, 0, 0.5)"
              color="white"
              zIndex="2"
              @click="nextSlide"
            >
              ›
            </chakra-button>
      
            <chakra-box
              d="flex"
              justifyContent="center"
              pos="absolute"
              bottom="3"
              w="100%"
            >
              <chakra-box
                v-for="(image, index) in images"
                :key="index"
                cursor="pointer"
                boxSize="10px"
                m="2"
                bg="white"
                borderRadius="full"
                :opacity="index === activeIndex ? '1' : '0.5'"
                @click="goToSlide(index)"
              ></chakra-box>
            </chakra-box>
          </chakra-box>
        </chakra-box>
      </template>
      
      <script setup>
      import { ref } from 'vue';
      
      const activeIndex = ref(0);
      
      const images = [
        { src: 'https://via.placeholder.com/800x300?text=Slide+1', alt: 'Slide 1' },
        { src: 'https://via.placeholder.com/800x300?text=Slide+2', alt: 'Slide 2' },
        { src: 'https://via.placeholder.com/800x300?text=Slide+3', alt: 'Slide 3' },
      ];
      
      const prevSlide = () => {
        activeIndex.value =
          activeIndex.value === 0 ? images.length - 1 : activeIndex.value - 1;
      };
      
      const nextSlide = () => {
        activeIndex.value =
          activeIndex.value === images.length - 1 ? 0 : activeIndex.value + 1;
      };
      
      const goToSlide = (index) => {
        activeIndex.value = index;
      };
      </script>
      
      <style scoped></style>
      