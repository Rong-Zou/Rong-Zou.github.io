---
layout: default
title: Visual Odometry
description: A complete visual odometry pipeline with local optimization, loop detection and loop closure
img: assets/img/vslam-loop.gif
importance: 1
category: Computer Vision
github: 
github_stars:
---

<h2 align="center">
  <b>A Visual Odometry Pipeline</b>
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
    <a href="vo.pdf" target="_blank"
        class="button is-normal is-rounded is-dark">
      <span class="icon">
          <i class="fas fa-file-pdf"></i>
      </span>
      <span>Report</span>
    </a>&nbsp;&nbsp;
  </span>


  <!-- Supp Link. -->
  <!-- <span class="link-block">
    <a href="xxx" target="_blank"
        class="button is-normal is-rounded is-dark">
      <span class="icon">
          <i class="fas fa-file-pdf"></i>
      </span>
      <span>Supplementary Material</span>
    </a>
  </span> -->

  
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

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        <img src="basic_vo_kitti.png" width="100%" class="center" />
    </div>
    <div class="col-sm mt-3 mt-md-0">
        <img src="standard_vo_kitti.png" width="100%" class="center" />
    </div>
</div>

<div class="caption">
    <h6><b>Left: baseline visual odometry run on the KITTI dataset</b></h6>
    <h6><b>Right: after adding local optimization, run on the same dataset. Scale drift is largely eliminated.</b></h6>
</div>


<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        <img src="standard_vo_kitti_loopcorrection.png" width="100%" class="center" id="standard_vo_kitti_loopcorrection"/>
    </div>
    <div class="col-sm mt-3 mt-md-0">
        <img src="vslam_kitti_loopcorrection.png" width="100%" class="center" />
    </div>
</div>

<div class="caption">
    <h6><b>Left: baseline + local optimization, run on the KITTI dataset</b></h6>
    <h6><b>Right: after adding global optimization, run on the same dataset. The loop is detected and corrected.</b></h6>
</div>


<hr>

<h3 align="center" class="subtitle has-text-centered">
  <b>Abstract / Description</b>
</h3>

<p style="text-align:justify; padding-top:10px">
In this project, we implemented a monocular visual odometry (VO) pipeline with the most essential components: initialization of 3D landmarks, keypoint tracking between two frames, pose estimation using established 2D to 3D correspondences, and triangulation of new landmarks. Building upon this baseline VO, we incorporated local optimization (sliding-window bundle adjustment) to mitigate the scale drift, and global optimization (loop detection and loop correction) to transform the VO pipeline into a visual simultaneous localization and mapping (VSLAM) framework. The performance of the pipelines are evaluated on three different datasets: Parking, <a href="https://www.cvlibs.net/datasets/kitti/eval_odometry.php">KITTI</a> and <a href="https://www.mrpt.org/MalagaUrbanDataset">Malaga</a>.
</p>
<hr>
<!-- TODO: change when have time.
<h3 align="center" class="subtitle has-text-centered">
  <b>Project Details</b>
</h3>
<p style="text-align:justify; padding-top:10px">
We first pool the extracted features according to the initial predictions obtained from the first stage RPN to generate regions-of-interests (ROIs), i.e. smaller pools of information at and around likely objects. 
</p>
<p style="text-align:justify; padding-top:10px">
After that, we assign each ROI a ground truth bounding box, and classify each of them as foreground sample, easy background sample or hard background sample. During training, we feed different classes of samples into the network as evenly as possible. This is to make the BRN to predict an accurate confidence score for each of the ROI. The training of BRN is supervised via smoothL1 loss over the box parameters and BCE loss over the foreground/background categories. 
</p>
<p style="text-align:justify; padding-top:10px">
For each ROI, the network will output a bounding box and a confident score indicating its confidence that this box contains a vehicle. Since there are multiple ROIs sent into the model for each scene, we perform Non-Maximum Suppression to reduce the number of predictions during evaluation. The resulting predictions from our network are evaluated on three ground truth bounding box difficulty levels: easy, moderate, hard (determined based on distance, truncation and occlusion).
</p>
<p style="text-align:justify; padding-top:10px">
With the above BRN as the baseline model, we presented two methods for addressing the shortcomings and improving the performance of the baseline network, namely, canonical transformation
for the model to predict distant objects more accurately, and data augmentation for it to not overfit the training data. We also studied their respective effects on the baseline network
and the effect when they are combined. 
</p>
<hr> -->

<h3 align="center" class="subtitle has-text-centered">
  <b>Results / Conclusion</b>
</h3>


<ul>
  
  <li> 
    <p style="text-align:justify; padding-top:10px">
      The baseline VO fails to run accurately and stably, even on the simplest dataset - the Parking dataset, as shown in the figure below.
    </p>
  </li>

  <div class="row">
    <div class="col-sm mt-3 mt-md-0">
        <img src="basic_vo_parking.png" width="100%" class="center" />
    </div>
    <div class="col-sm mt-3 mt-md-0">
        <img src="basic_vo_kitti.png" width="100%" class="center" />
    </div>
  </div>


  <div class="caption">
      <h6><b>The baseline VO run on the Parking (left) and KITTI (right) datasets</b></h6>
  </div>

  <li> 
    <p style="text-align:justify; padding-top:10px">
      After integrated with local optimization, the VO can run stably and with much higher accuracy on different datasets, which can be seen from the following videos, but it cannot detect and correct loops in KITTI (see in the 3rd video below, or the <a href="#standard_vo_kitti_loopcorrection">figure</a> at the beginning).
    </p>
    <p>
      <div align="center" class="video-container">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/XGf6oBe8dAc" title="YouTube video player" frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        <div class="caption">
          <h6><b>Baseline + Local Optimization, Parking</b></h6>
        </div>
      </p> 
      <p>
        <div align="center" class="video-container">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/kfZQBot3uSA" title="YouTube video player" frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        <div class="caption">
          <h6><b>Baseline + Local Optimization, Malaga</b></h6>
        </div>
      </p> 
      <p>
        <div align="center" class="video-container">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/vaN-qcTRiaE" title="YouTube video player" frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        <div class="caption">
          <h6><b>Baseline + Local Optimization, KITTI</b></h6>
        </div>
      </p> 
  </li>

  <li> 
    <p style="text-align:justify; padding-top:10px">
      When further combined with global optimization, the VO is capable of detecting and closing loops, and it can run successfully on KITTI. The demo is shown below.
    </p>
  </li>

  <p>
    <div align="center" class="video-container">
      <iframe width="560" height="315" src="https://www.youtube.com/embed/nVR32trPZJI" title="YouTube video player" frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
    <div class="caption">
      <h6><b>Baseline + Local Optimization + Global Optimization, KITTI</b></h6>
    </div>
  </p> 
</ul>
