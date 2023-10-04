---
layout: default
title: Depth Estimation
description: An approach to enhance the performance of supervised MDE methods using virtual views
img: assets/img/3dv.png
importance: 3
category: Computer Vision 
---

<h2 align="center">
  <b>Monocular Depth Estimation with Virtual View Supervision</b>
</h2>
<!-- <div class="column is-full_width">
  <h4 align="center">
    <b>Rong Zou</b>,
    Matthew Hanlon
  </h4>
</div> -->


<div align="center" class="publication-links">
  <!-- PDF Link. -->
  <span class="link-block">
    <a href="poster.pdf" target="_blank"
        class="button is-normal is-rounded is-dark">
      <span class="icon">
          <i class="fas fa-file-pdf"></i>
      </span>
      <span>Poster</span>
    </a>&nbsp;&nbsp;
  </span>


  <!-- Supp Link. -->
  <span class="link-block">
    <a href="mde_vvs.pdf" target="_blank"
        class="button is-normal is-rounded is-dark">
      <span class="icon">
          <i class="fas fa-file-pdf"></i>
      </span>
      <span>Report</span>
    </a>
  </span>

  
  <!-- Video Link. -->
  <!-- <span class="link-block">
    <a href="https://www.youtube.com/watch?v=9q059CFGcVA"
        class="external-link button is-normal is-rounded is-dark">
      <span class="icon">
          <i class="fab fa-youtube"></i>
      </span>
      <span>Video</span>
    </a>
  </span> -->


  <!-- Code Link. -->
  <!-- <span class="link-block">
    <a href="https://github.com/pengsongyou/openscene" target="_blank" class="external-link button is-normal is-rounded is-dark" style="background-color: #808080">
      <span class="icon">
          <i class="fab fa-github"></i>
      </span>
      <span >Code</span>
      </a>
  </span> -->
  
</div> 


<br>

<div align="center">  
  <img src="idea.png" width="80%" class="center" />
</div>
<div class="caption">
    <h6><b>The core idea of our proposed method</b></h6>
</div>

<img src="results.jpg" width="100%" class="center" id="qual_res"/>
<div class="caption">
    <h6><b>Comparison of qualitative results between the model trained with original data (baseline) and the model trained with additional virtual views (ous). A zoom-in version is shown in the second row. </b></h6>
</div>

<hr>

<h3 align="center" class="subtitle has-text-centered">
  <b>Abstract / Description</b>
</h3>

<p style="text-align:justify; padding-top:10px">
Data-driven methods have gained popularity for addressing
the monocular depth estimation (MDE) task.
Among them, supervised methods, which yield state-of-theart
(SOTA) results, require large amounts of labeled training
data, posing challenges in terms of costly ground-truth
label collection. This work aims to enhance the performance
of existing supervised learning-based MDE methods
by generating a substantial number of virtual views as
additional supervision signals, circumventing the laborious
and time-consuming process of collecting extra data. We
propose leveraging the capabilities of Neural Implicit Surface
Reconstruction (NISR) techniques to augment an existing
limited-scale dataset by generating novel scene perspectives
and corresponding high-quality depth maps. Experimental
results demonstrate that the augmented dataset
significantly boosts the performance of supervised-learning
MDE networks. This highlights the potential of the NISR
approach for scaling small-scale datasets and provides a
valuable solution to further improve the efficacy of existing
supervised MDE models without the need for an expensive
label collection process.
</p>
<hr>

<h3 align="center" class="subtitle has-text-centered">
  <b>Project Details</b>
</h3>


<img src="pipeline.png" width="100%" class="center" id="improved_pred"/>
<div class="caption">
    <h6><b>The pipeline of the proposed method</b></h6>
</div>


<p style="text-align:justify; padding-top:10px">
We first generate a small-scale dataset which contains RGB-depth pairs by rendering the <a href="https://github.com/facebookresearch/Replica-Dataset">Replica dataset</a>. 

</p>
<p style="text-align:justify; padding-top:10px">
Then, we obtain the normals corresponding to the RGB-D images using a pre-trained <a href="https://omnidata.vision/">Omnidata</a> model. With the RGB images as well as the depth and normal cues, we employ <a href="https://github.com/autonomousvision/monosdf">MonoSDF</a> as the NISR method and reconstruct each scene in the small-scale dataset. After reconstruction, we generate novel views, i.e. virtual RGB-D images for each scene from the trained MonoSDFs.

</p>
<p style="text-align:justify; padding-top:10px">
The original data is combined with the virtual views to form large-scale datasets. We train the same MDE network on the original data, which yields the baseline results, and on the augmented datasets to verify the effectiveness of the proposed method.

</p>

<hr>

<h3 align="center" class="subtitle has-text-centered">
  <b>Results / Conclusion</b>
</h3>

<p style="text-align:justify; padding-top:10px">
The depth prediction results on the test set evaluated using different metrics are shown in the table below, which demonstrate the effectiveness of training MDE with virtual views as additional supervisory signals. An example of qualitative results can be seen in the <a href="#qual_res">figure</a> at the beginning.
</p>

<div align="center">  
  <img src="results_table.jpg" width="80%" class="center" id="results_table"/>
</div>
<div class="caption">
    <h6><b>Comparison of quantitative results on the test set</b></h6>
</div>



